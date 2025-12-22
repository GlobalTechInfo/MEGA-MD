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

const customTemp = path.join(process.cwd(), 'temp');

if (!fs.existsSync(customTemp)) {
    console.log('Temp folder does not exist. Creating it...');
    fs.mkdirSync(customTemp, { recursive: true });
}

const files = fs.readdirSync(customTemp);
let deletedCount = 0;

files.forEach(file => {
    const filePath = path.join(customTemp, file);
    try {
        const stats = fs.statSync(filePath);
        const ageInMs = Date.now() - stats.mtimeMs;
        const threeHours = 1 * 60 * 60 * 1000;

        if (ageInMs > threeHours) {
            fs.unlinkSync(filePath);
            deletedCount++;
        }
    } catch (err) {
        console.error(`❌ Could not process ${file}: ${err.message}`);
    }
});

console.log(`✅ Cleanup finished. Deleted ${deletedCount} files.`);
process.exit(0);


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
 
