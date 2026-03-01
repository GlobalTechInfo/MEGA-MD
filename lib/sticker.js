const { Sticker, StickerTypes } = require('stickers-formatter')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const webp = require('node-webpmux')
const settings = require('../settings')
const tmp = path.join(__dirname, '../tmp')

async function sticker(isImage, url, packname, author) {
  try {
    const response = await fetch(url)
    const buffer = await response.buffer()
    return await new Sticker(buffer, {
      pack: settings.packname || 'MEGA-MD',
      author: settings.author || 'GlobalTechInfo',
      type: StickerTypes.DEFAULT
    }).toBuffer()
  } catch (error) {
    console.error('Error in sticker creation:', error)
    return null
  }
}

async function sticker2(img, url) {
  const input = url || img
  return await new Sticker(input, { type: StickerTypes.DEFAULT }).toBuffer()
}

async function sticker3(img, url, packname, author) {
  const input = url || img
  return await new Sticker(input, {
    pack: packname,
    author,
    type: StickerTypes.DEFAULT
  }).toBuffer()
}

async function sticker4(img, url) {
  const input = url || img
  return await new Sticker(input, { type: StickerTypes.DEFAULT }).toBuffer()
}

async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
  const input = url || img
  return await new Sticker(input, {
    pack: packname || settings.packname,
    author: author || settings.author,
    type: StickerTypes.DEFAULT,
    categories,
    ...extra
  }).toBuffer()
}

async function sticker6(img, url) {
  const input = url || img
  return await new Sticker(input, { type: StickerTypes.FULL }).toBuffer()
}

async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  const img = new webp.Image()
  const stickerPackId = crypto.randomBytes(32).toString('hex')
  const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, ...extra }
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
  let exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}

const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false
}

module.exports = {
  sticker,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  addExif,
  support
}
