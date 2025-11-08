const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, 'frontend', 'dist', 'browser');
const distDir = path.join(__dirname, 'frontend', 'dist');

if (fs.existsSync(browserDir)) {
  console.log('Copying browser contents to dist/...');
  const files = fs.readdirSync(browserDir);
  files.forEach(file => {
    const src = path.join(browserDir, file);
    const dest = path.join(distDir, file);
    if (fs.lstatSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  });
  console.log('Copy complete!');
} else {
  console.log('No browser directory found, skipping copy.');
}
