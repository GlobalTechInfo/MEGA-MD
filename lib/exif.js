const { Sticker, StickerTypes } = require('stickers-formatter')
const webp = require('node-webpmux')
const path = require('path')
const { tmpdir } = require('os')
const Crypto = require('crypto')
const fs = require('fs')

async function imageToWebp(media) {
  return await new Sticker(media, { type: StickerTypes.DEFAULT }).toBuffer()
}

async function videoToWebp(media) {
  return await new Sticker(media, { type: StickerTypes.DEFAULT }).toBuffer()
}

async function writeExifImg(media, metadata) {
  const buff = await new Sticker(media, {
    pack: metadata.packname,
    author: metadata.author,
    categories: metadata.categories || [''],
    type: StickerTypes.DEFAULT
  }).toBuffer()

  const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  fs.writeFileSync(tmpFileOut, buff)
  return tmpFileOut
}

async function writeExifVid(media, metadata) {
  const buff = await new Sticker(media, {
    pack: metadata.packname,
    author: metadata.author,
    categories: metadata.categories || [''],
    type: StickerTypes.DEFAULT
  }).toBuffer()

  const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  fs.writeFileSync(tmpFileOut, buff)
  return tmpFileOut
}

async function writeExif(media, metadata) {
  const input = /webp|image|video/.test(media.mimetype) ? media.data : null
  if (!input) return null

  const buff = await new Sticker(input, {
    pack: metadata.packname,
    author: metadata.author,
    categories: metadata.categories || [''],
    type: StickerTypes.DEFAULT
  }).toBuffer()

  const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  fs.writeFileSync(tmpFileOut, buff)
  return tmpFileOut
}

module.exports = { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif }
