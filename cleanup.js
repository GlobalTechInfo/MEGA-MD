const fs = require('fs');
const path = require('path');

const customTemp = path.join(process.cwd(), 'temp');
const customTmp = path.join(process.cwd(), 'tmp');
const sessionDir = path.join(process.cwd(), 'session');

if (!fs.existsSync(customTemp)) {
  console.log('Temp folder does not exist. Creating it...');
  fs.mkdirSync(customTemp, { recursive: true });
}
if (!fs.existsSync(customTmp)) {
  console.log('Tmp folder does not exist. Creating it...');
  fs.mkdirSync(customTmp, { recursive: true });
}

const cleanOldFiles = (dir) => {
  let deleted = 0;
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    try {
      const stats = fs.statSync(filePath);
      if (Date.now() - stats.mtimeMs > 1 * 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
        deleted++;
      }
    } catch (err) {
      console.error(`❌ Could not process ${file}: ${err.message}`);
    }
  });
  return deleted;
};

console.log(`✅ Temp cleanup finished. Deleted ${cleanOldFiles(customTemp)} files.`);
console.log(`✅ Tmp cleanup finished. Deleted ${cleanOldFiles(customTmp)} files.`);

if (fs.existsSync(sessionDir)) {
  let sessionDeleted = 0;
  fs.readdirSync(sessionDir).forEach(file => {
    if (file === 'creds.json') return;
    try {
      fs.unlinkSync(path.join(sessionDir, file));
      sessionDeleted++;
    } catch (err) {
      console.error(`❌ Could not delete session file ${file}: ${err.message}`);
    }
  });
  console.log(`✅ Session cleanup finished. Deleted ${sessionDeleted} files.`);
}

process.exit(0);
