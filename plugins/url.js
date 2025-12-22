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
 

const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const fs = require('fs')
const path = require('path')
const { UploadFileUgu, TelegraPh } = require('../lib/uploader')

async function getMediaBuffer(msg, sock) {
  return await downloadMediaMessage(
    msg,
    'buffer',
    {},
    {
      logger: sock.logger,
      reuploadRequest: sock.updateMediaMessage
    }
  )
}

function getQuotedMessage(message) {
  const ctx = message.message?.extendedTextMessage?.contextInfo
  if (!ctx?.quotedMessage) return null

  return {
    key: {
      remoteJid: message.key.remoteJid,
      fromMe: false,
      id: ctx.stanzaId,
      participant: ctx.participant
    },
    message: ctx.quotedMessage
  }
}

function getExtFromMessage(msg) {
  const m = msg.message
  if (m.imageMessage) return '.jpg'
  if (m.videoMessage) return '.mp4'
  if (m.audioMessage) return '.mp3'
  if (m.stickerMessage) return '.webp'
  if (m.documentMessage) {
    return path.extname(m.documentMessage.fileName || '') || '.bin'
  }
  return null
}

module.exports = {
  command: 'url',
  aliases: ['geturl', 'mediaurl'],
  category: 'tools',
  description: 'Get a URL for media (image, video, audio, sticker, document).',
  usage: '.url (send or reply to media)',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid

    try {
      let targetMsg = null

      if (
        message.message?.imageMessage ||
        message.message?.videoMessage ||
        message.message?.audioMessage ||
        message.message?.stickerMessage ||
        message.message?.documentMessage
      ) {
        targetMsg = message
      }
      if (!targetMsg) {
        const quoted = getQuotedMessage(message)
        if (quoted) targetMsg = quoted
      }

      if (!targetMsg) {
        return sock.sendMessage(
          chatId,
          { text: 'Send or reply to a media to get a URL.' },
          { quoted: message }
        )
      }

      const ext = getExtFromMessage(targetMsg)
      if (!ext) throw new Error('Unsupported media type')

      const buffer = await getMediaBuffer(targetMsg, sock)
      if (!buffer) throw new Error('Failed to download media')

      const tempDir = path.join(__dirname, '../temp')
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

      const tempPath = path.join(tempDir, `${Date.now()}${ext}`)
      fs.writeFileSync(tempPath, buffer)

      let url = ''

      try {
        if (['.jpg', '.png', '.webp'].includes(ext)) {
          try {
            url = await TelegraPh(tempPath)
          } catch {
            const res = await UploadFileUgu(tempPath)
            url = typeof res === 'string'
              ? res
              : (res.url || res.url_full || '')
          }
        } else {
          const res = await UploadFileUgu(tempPath)
          url = typeof res === 'string'
            ? res
            : (res.url || res.url_full || '')
        }
      } finally {
        setTimeout(() => {
          try { fs.unlinkSync(tempPath) } catch {}
        }, 2000)
      }

      if (!url) {
        return sock.sendMessage(
          chatId,
          { text: 'Failed to upload media.' },
          { quoted: message }
        )
      }

      await sock.sendMessage(
        chatId,
        { text: `URL: ${url}` },
        { quoted: message }
      )

    } catch (error) {
      console.error('[URL] error:', error)
      await sock.sendMessage(
        chatId,
        { text: '❌ Failed to convert media to URL.' },
        { quoted: message }
      )
    }
  }
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
 