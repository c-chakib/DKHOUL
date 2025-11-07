import mongoose from 'mongoose';

const LOCAL_URI = process.env.LOCAL_MONGO_URI as string;
const TARGET_URI = process.env.TARGET_MONGO_URI as string;
const DB_NAME = process.env.DB_NAME || 'dkhoul';

if (!LOCAL_URI || !TARGET_URI) {
  console.error('Please set LOCAL_MONGO_URI and TARGET_MONGO_URI env variables');
  process.exit(1);
}

async function getCollectionNames(conn: mongoose.Connection): Promise<string[]> {
  const names = await conn.db.listCollections({}, { nameOnly: true }).toArray();
  return names
    .map(n => n.name)
    .filter(n => !n.startsWith('system.'))
    .sort();
}

async function countDocs(conn: mongoose.Connection, coll: string): Promise<number> {
  return conn.db.collection(coll).countDocuments();
}

async function main() {
  console.log('\n🔍 Comparing databases');
  console.log('- Source (local):', LOCAL_URI.replace(/:\\?[^@]+@/, ':***@'));
  console.log('- Target (atlas):', TARGET_URI.replace(/:\\?[^@]+@/, ':***@'));
  console.log('- DB Name:', DB_NAME);

  const local = await mongoose.createConnection(LOCAL_URI).asPromise();
  const target = await mongoose.createConnection(TARGET_URI).asPromise();

  try {
    const localCols = await getCollectionNames(local);
    const targetCols = await getCollectionNames(target);
    const all = Array.from(new Set([...localCols, ...targetCols]));

    console.log(`\nCollections found: ${all.length}`);

    let ok = true;
    for (const name of all) {
      const [lc, tc] = await Promise.all([
        localCols.includes(name) ? countDocs(local, name) : Promise.resolve(0),
        targetCols.includes(name) ? countDocs(target, name) : Promise.resolve(0)
      ]);
      const status = lc === tc ? 'OK' : 'DIFF';
      if (status === 'DIFF') ok = false;
      console.log(`${status.padEnd(4)}  ${name.padEnd(32)} local=${String(lc).padStart(6)}  atlas=${String(tc).padStart(6)}  ${lc===tc?'':'<- mismatch'}`);
    }

    console.log('\nSummary:', ok ? '✅ Counts match for all collections' : '⚠️ Differences detected');
  } finally {
    await Promise.all([local.close(), target.close()]);
  }
}

main().catch(err => {
  console.error('Compare error:', err);
  process.exit(1);
});
