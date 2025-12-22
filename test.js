/*****************************************************************************
 *                                                                           *
 *                     Developed By Qasim Ali                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/GlobalTechInfo                         *
 *  ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07     *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the MEGA-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
 


const fs = require('fs');
const path = require('path');
const vm = require('vm');
const chalk = require('chalk');

const folders = [
  path.join(__dirname, './lib'),
  path.join(__dirname, './plugins')
];

let totalFiles = 0;
let okFiles = 0;
let errorFiles = 0;

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    console.log(chalk.yellow(`⚠️ Folder not found: ${folder}`));
    return;
  }

  const files = fs.readdirSync(folder).filter(file => file.endsWith('.js'));
  
  files.forEach(file => {
    totalFiles++;
    const filePath = path.join(folder, file);

    try {
      const code = fs.readFileSync(filePath, 'utf-8');
      new vm.Script(code); 

      try {
        delete require.cache[require.resolve(filePath)];
      } catch (e) {}
      
      const moduleExport = require(filePath);
      if (folder.includes('plugins')) {
        if (!moduleExport.command && !moduleExport.handler) {
          throw new Error("Missing 'command' or 'handler' export. Check your module.exports structure.");
        }
      }

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


/*****************************************************************************
 *                                                                           *
 *                     Developed By Qasim Ali                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/GlobalTechInfo                         *
 *  ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07     *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the MEGA-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
 
