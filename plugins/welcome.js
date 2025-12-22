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
 

const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');
const fetch = require('node-fetch');

module.exports = {
  command: 'welcome',
  aliases: ['setwelcome'],
  category: 'admin',
  description: 'Configure welcome message for the group',
  usage: '.welcome [on/off/message]',
  groupOnly: true,
  adminOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    const matchText = args.join(' ');
    await handleWelcome(sock, chatId, message, matchText);
  }
};

async function handleJoinEvent(sock, id, participants) {
  const isWelcomeEnabled = await isWelcomeOn(id);
  if (!isWelcomeEnabled) return;

  const customMessage = await getWelcome(id);

  const groupMetadata = await sock.groupMetadata(id);
  const groupName = groupMetadata.subject;
  const groupDesc = groupMetadata.desc || 'No description available';

  const channelInfo = {
    contextInfo: {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363319098372999@newsletter',
        newsletterName: 'MEGA MD',
        serverMessageId: -1
      }
    }
  };

  for (const participant of participants) {
    try {
      const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
      const user = participantString.split('@')[0];
      
      let displayName = user;
      try {
        const contact = await sock.getBusinessProfile(participantString);
        if (contact && contact.name) {
          displayName = contact.name;
        } else {
          const groupParticipants = groupMetadata.participants;
          const userParticipant = groupParticipants.find(p => p.id === participantString);
          if (userParticipant && userParticipant.name) {
            displayName = userParticipant.name;
          }
        }
      } catch (nameError) {
        console.log('Could not fetch display name, using phone number');
      }
      
      let finalMessage;
      if (customMessage) {
        finalMessage = customMessage
          .replace(/{user}/g, `@${displayName}`)
          .replace(/{group}/g, groupName)
          .replace(/{description}/g, groupDesc);
      } else {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        
        finalMessage = `╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @${displayName} 👋\n┃Member count: #${groupMetadata.participants.length}\n┃𝚃𝙸𝙼𝙴: ${timeString}⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@${displayName}* Welcome to *${groupName}*! 🎉\n*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*\n${groupDesc}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ MEGA-MD*`;
      }
      
      try {
        let profilePicUrl = `https://img.pyrocdn.com/dbKUgahg.png`;
        try {
          const profilePic = await sock.profilePictureUrl(participantString, 'image');
          if (profilePic) {
            profilePicUrl = profilePic;
          }
        } catch (profileError) {
          console.log('Could not fetch profile picture, using default');
        }
        
        const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${groupMetadata.participants.length}&avatar=${encodeURIComponent(profilePicUrl)}`;
        
        const response = await fetch(apiUrl);
        if (response.ok) {
          const imageBuffer = await response.buffer();
          
          await sock.sendMessage(id, {
            image: imageBuffer,
            caption: finalMessage,
            mentions: [participantString],
            ...channelInfo
          });
          continue;
        }
      } catch (imageError) {
        console.log('Image generation failed, falling back to text');
      }
      
      await sock.sendMessage(id, {
        text: finalMessage,
        mentions: [participantString],
        ...channelInfo
      });
    } catch (error) {
      console.error('Error sending welcome message:', error);
      const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
      const user = participantString.split('@')[0];
      
      let fallbackMessage;
      if (customMessage) {
        fallbackMessage = customMessage
          .replace(/{user}/g, `@${user}`)
          .replace(/{group}/g, groupName)
          .replace(/{description}/g, groupDesc);
      } else {
        fallbackMessage = `Welcome @${user} to ${groupName}! 🎉`;
      }
      
      await sock.sendMessage(id, {
        text: fallbackMessage,
        mentions: [participantString],
        ...channelInfo
      });
    }
  }
}

module.exports.handleJoinEvent = handleJoinEvent;


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
 