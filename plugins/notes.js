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
 

let notesDB = {};

module.exports = {
  command: 'notes',
  aliases: ['note'],
  category: 'menu',
  description: 'Store, view, and delete your personal notes',
  usage: '.notes <add|all|del|delall> [text|ID]',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const sender = message.key.participant || message.key.remoteJid;
    try {
      const action = args[0] ? args[0].toLowerCase() : null;
      const content = args.slice(1).join(" ").trim();

      const menuText = `
╭───── *『 NOTES 』* ───◆
┃ Store notes for later use
┃
┃ ● Add Note
┃    .notes add your text here
┃
┃ ● Get All Notes
┃    .notes all
┃
┃ ● Delete Note
┃    .notes del noteID
┃
┃ ● Delete All Notes
┃    .notes delall
╰━━━━━━━━━━━━━━━━━──⊷`;

      if (!action) {
        return await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
      }
      if (action === 'add') {
        if (!content) {
          return await sock.sendMessage(chatId, {
            text: "*Please write a note to save.*\nExample: .notes add buy milk"
          }, { quoted: message });
        }
        if (!notesDB[sender]) notesDB[sender] = [];
        const newID = notesDB[sender].length + 1;
        notesDB[sender].push({ id: newID, text: content });

        return await sock.sendMessage(chatId, {
          text: `✅ Note saved.\nID: ${newID}`
        }, { quoted: message });
      }
      if (action === 'all') {
        if (!notesDB[sender] || notesDB[sender].length === 0) {
          return await sock.sendMessage(chatId, { text: "*You have no notes saved.*" }, { quoted: message });
        }

        const list = notesDB[sender].map(n => `${n.id}. ${n.text}`).join("\n");
        return await sock.sendMessage(chatId, { text: `*📝 Your Notes:*\n\n${list}` }, { quoted: message });
      }
      if (action === 'del') {
        const id = parseInt(args[1]);
        if (!id || !notesDB[sender] || !notesDB[sender].find(n => n.id === id)) {
          return await sock.sendMessage(chatId, {
            text: "Invalid note ID.\nExample: .notes del 1"
          }, { quoted: message });
        }
        notesDB[sender] = notesDB[sender].filter(n => n.id !== id);
        return await sock.sendMessage(chatId, { text: `*✅ Note ID ${id} deleted.*` }, { quoted: message });
      }
      if (action === 'delall') {
        if (!notesDB[sender] || notesDB[sender].length === 0) {
          return await sock.sendMessage(chatId, { text: "*You have no notes to delete.*" }, { quoted: message });
        }
        notesDB[sender] = [];
        return await sock.sendMessage(chatId, { text: "*✅ All notes deleted successfully.*" }, { quoted: message });
      }
      return await sock.sendMessage(chatId, { text: menuText }, { quoted: message });

    } catch (err) {
      console.error("Notes Command Error:", err);
      await sock.sendMessage(chatId, { text: "❌ Error in notes module." }, { quoted: message });
    }
  }
};

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
 
