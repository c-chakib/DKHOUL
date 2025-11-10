const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check services
    const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false, collection: 'services' }));
    const serviceCount = await Service.countDocuments();
    console.log(`\n📊 SERVICES: ${serviceCount} total`);
    
    if (serviceCount > 0) {
      const services = await Service.find().limit(5).lean();
      console.log('\n🔍 Sample Services:');
      services.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.title || 'No title'} | ${s.category || 'No category'} | ${s.pricing?.amount || s.price || 'No price'} DH | Status: ${s.status || 'unknown'}`);
      });
    } else {
      console.log('⚠️  NO SERVICES FOUND IN DATABASE!');
    }

    // Check users
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
    const userCount = await User.countDocuments();
    console.log(`\n👥 USERS: ${userCount} total`);
    
    if (userCount > 0) {
      const users = await User.find().limit(3).lean();
      console.log('\n🔍 Sample Users:');
      users.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.profile?.firstName || u.email || 'No name'} | ${u.role || 'No role'}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
