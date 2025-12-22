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
 


const compliments = [
    "You're amazing just the way you are!",
    "You have a great sense of humor!",
    "You're incredibly thoughtful and kind.",
    "You are more powerful than you know.",
    "You light up the room!",
    "You're a true friend.",
    "You inspire me!",
    "Your creativity knows no bounds!",
    "You have a heart of gold.",
    "You make a difference in the world.",
    "Your positivity is contagious!",
    "You have an incredible work ethic.",
    "You bring out the best in people.",
    "Your smile brightens everyone's day.",
    "You're so talented in everything you do.",
    "Your kindness makes the world a better place.",
    "You have a unique and wonderful perspective.",
    "Your enthusiasm is truly inspiring!",
    "You are capable of achieving great things.",
    "You always know how to make someone feel special.",
    "Your confidence is admirable.",
    "You have a beautiful soul.",
    "Your generosity knows no limits.",
    "You have a great eye for detail.",
    "Your passion is truly motivating!",
    "You are an amazing listener.",
    "You're stronger than you think!",
    "Your laughter is infectious.",
    "You have a natural gift for making others feel valued.",
    "You make the world a better place just by being in it."
];

module.exports = {
  command: 'compliment',
  aliases: ['praise', 'nice'],
  category: 'group',
  description: 'Send a random compliment to a user',
  usage: '.compliment @user',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    try {
      if (!message || !chatId) {
        console.log('Invalid message or chatId:', { message, chatId });
        return;
      }

      let userToCompliment;
      if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToCompliment =
          message.message.extendedTextMessage.contextInfo.mentionedJid[0];
      }
      else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToCompliment =
          message.message.extendedTextMessage.contextInfo.participant;
      }

      if (!userToCompliment) {
        await sock.sendMessage(chatId, {
          text: 'Please mention someone or reply to their message to compliment them!'
        }, { quoted: message });
        return;
      }

      const compliment =
        compliments[Math.floor(Math.random() * compliments.length)];

      await new Promise(resolve => setTimeout(resolve, 1000));

      await sock.sendMessage(chatId, {
        text: `Hey @${userToCompliment.split('@')[0]}, ${compliment}`,
        mentions: [userToCompliment]
      }, { quoted: message });

    } catch (error) {
      console.error('Error in compliment command:', error);

      if (error?.data === 429) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          await sock.sendMessage(chatId, {
            text: 'Please try again in a few seconds.'
          }, { quoted: message });
        } catch (retryError) {
          console.error('Error sending retry message:', retryError);
        }
      } else {
        try {
          await sock.sendMessage(chatId, {
            text: 'An error occurred while sending the compliment.'
          }, { quoted: message });
        } catch (sendError) {
          console.error('Error sending error message:', sendError);
        }
      }
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
 

