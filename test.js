const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const folders = [
  path.join(__dirname, './lib'),
  path.join(__dirname, './plugins')
];

let totalFiles = 0, okFiles = 0, errorFiles = 0;

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    console.log(chalk.yellow(`⚠️ Folder not found: ${folder}`));
    return;
  }

  fs.readdirSync(folder).filter(f => f.endsWith('.js')).forEach(file => {
    totalFiles++;
    const filePath = path.join(folder, file);
    try {
      const code = fs.readFileSync(filePath, 'utf-8');
      new (require('vm').Script)(code);
      okFiles++;
    } catch (e) {
      errorFiles++;
      console.error(chalk.red(`❌ ERROR in ${filePath}:`));
      console.error(chalk.white(`   ${e.message}\n`));
    }
  });
});

console.log(chalk.blueBright(`\n🎯 Validation Summary:`));
console.log(chalk.blueBright(`Total files checked: ${totalFiles}`));
console.log(chalk.greenBright(`✅ OK files: ${okFiles}`));

if (errorFiles > 0) {
  console.log(chalk.redBright(`❌ Files with errors: ${errorFiles}\n`));
  process.exit(1);
} else {
  console.log(chalk.green('✨ All files passed validation!\n'));
  process.exit(0);
}
