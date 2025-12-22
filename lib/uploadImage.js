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
 


const axios = require('axios');
const FormData = require('form-data');
const FileType = require('file-type');

/**
 * Upload buffer to catbox.moe
 * @param {Buffer} buffer
 * @returns {Promise<string>} direct URL
 */
async function uploadImage(buffer) {
    try {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error('Invalid buffer');
        }

        // 10MB limit (Catbox rule)
        if (buffer.length > 10 * 1024 * 1024) {
            throw new Error('File exceeds 10MB limit');
        }

        const type = await FileType.fromBuffer(buffer);
        if (!type?.ext) {
            throw new Error('Unable to detect file type');
        }

        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('userhash', '');
        form.append('fileToUpload', buffer, `upload.${type.ext}`);

        const res = await axios.post(
            'https://catbox.moe/user/api.php',
            form,
            { headers: form.getHeaders(), timeout: 30000 }
        );

        if (typeof res.data !== 'string' || !res.data.startsWith('https://')) {
            throw new Error('Catbox upload failed');
        }

        return res.data;

    } catch (err) {
        console.error('[UPLOAD] Catbox error:', err.message);
        throw err;
    }
}

module.exports = { uploadImage };


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
 

