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
 


const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const STORE_FILE = './baileys_store.json'
const MESSAGE_COUNT_FILE = './data/messageCount.json'
const MONGO_URL = process.env.MONGO_URL
const POSTGRES_URL = process.env.POSTGRES_URL
const MYSQL_URL = process.env.MYSQL_URL
const SQLITE_URL = process.env.DB_URL || path.join(__dirname, 'baileys_store.db')

const MESSAGE_LIMITS = {
  memory: 20,
  sqlite: 70,
  mongo: Infinity,
  postgres: Infinity,
  mysql: Infinity
}

let MAX_MESSAGES = 20
try {
  const settings = require('../settings.js')
  if (settings.maxStoreMessages && typeof settings.maxStoreMessages === 'number') {
    MAX_MESSAGES = settings.maxStoreMessages
  }
} catch (e) {
  // Use default if settings not available
}

const TTL_MS = 30 * 24 * 60 * 60 * 1000
const CLEANUP_INTERVAL = 60 * 60 * 1000

/**
* IMPORTANT: Cleanup only deletes old MESSAGES (for storage management)
* Message COUNTS are NEVER deleted - they're kept forever for rank system!
*/

const compress = (obj) => {
  try {
    return zlib.deflateSync(JSON.stringify(obj))
  } catch (e) {
    console.error('[STORE] Compression error:', e.message)
    return Buffer.from(JSON.stringify(obj))
  }
}

const decompress = (buf) => {
  try {
    return JSON.parse(zlib.inflateSync(buf))
  } catch (e) {
    console.error('[STORE] Decompression error:', e.message)
    try {
      return JSON.parse(buf.toString())
    } catch (e2) {
      return null
    }
  }
}

function slimMessage(msg) {
  return {
    key: msg.key,
    message: msg.message,
    messageTimestamp: msg.messageTimestamp,
    participant: msg.participant,
    pushName: msg.pushName,
    broadcast: msg.broadcast
  }
}

let backend = 'memory'
let adapters = {}
let cleanupTimer = null
let messageLimit = MESSAGE_LIMITS.memory

/**
* ----------------- MongoDB -----------------
*/

if (MONGO_URL) {
  try {
    const mongoose = require('mongoose')
    
    const msgSchema = new mongoose.Schema({
      jid: { type: String, index: true },
      id: { type: String, unique: true },
      data: Buffer,
      ts: { type: Number, index: true }
    })
    
    const countSchema = new mongoose.Schema({
      chatId: { type: String, required: true },
      userId: { type: String, required: true },
      count: { type: Number, default: 0 }
    })
    countSchema.index({ chatId: 1, userId: 1 }, { unique: true })
    
    const metaSchema = new mongoose.Schema({
      key: { type: String, unique: true, required: true },
      value: { type: String, required: true }
    })
    
    mongoose.connect(MONGO_URL).catch(err => console.error('[MONGO] Connection error:', err))
    
    const Msg = mongoose.model('Message', msgSchema)
    const MsgCount = mongoose.model('MessageCount', countSchema)
    const Meta = mongoose.model('Metadata', metaSchema)
    
    adapters.mongo = {
      async save(jid, id, msg) {
        try {
          await Msg.updateOne(
            { jid, id },
            { data: compress(msg), ts: Date.now() },
            { upsert: true }
          )
        } catch (e) {
          console.error(`[MONGO] Save error:`, e.message)
        }
      },
      
      async load(jid, id) {
        try {
          const row = await Msg.findOne({ jid, id })
          return row ? decompress(row.data) : null
        } catch (e) {
          console.error(`[MONGO] Load error:`, e.message)
          return null
        }
      },
      
      async incrementCount(chatId, userId) {
        try {
          await MsgCount.updateOne(
            { chatId, userId },
            { $inc: { count: 1 } },
            { upsert: true }
          )
        } catch (e) {
          console.error('[MONGO] Increment count error:', e.message)
        }
      },
      
      async getCount(chatId, userId) {
        try {
          const doc = await MsgCount.findOne({ chatId, userId })
          return doc ? doc.count : 0
        } catch (e) {
          console.error('[MONGO] Get count error:', e.message)
          return 0
        }
      },
      
      async getAllCounts() {
        try {
          const docs = await MsgCount.find({})
          const result = { isPublic: true, messageCount: {} }
          docs.forEach(doc => {
            if (!result.messageCount[doc.chatId]) {
              result.messageCount[doc.chatId] = {}
            }
            result.messageCount[doc.chatId][doc.userId] = doc.count
          })
          const meta = await Meta.findOne({ key: 'isPublic' })
          if (meta) result.isPublic = meta.value === 'true'
          return result
        } catch (e) {
          console.error('[MONGO] Get all counts error:', e.message)
          return { isPublic: true, messageCount: {} }
        }
      },
      
      async setPublicMode(isPublic) {
        try {
          await Meta.updateOne(
            { key: 'isPublic' },
            { key: 'isPublic', value: isPublic.toString() },
            { upsert: true }
          )
        } catch (e) {
          console.error('[MONGO] Set public mode error:', e.message)
        }
      },

      async setMetadata(key, value) {
        try {
          await Meta.updateOne(
            { key },
            { key, value: value.toString() },
            { upsert: true }
          )
        } catch (e) {
          console.error(`[MONGO] Set metadata error:`, e.message)
        }
      },

      async getMetadata(key) {
        try {
          const doc = await Meta.findOne({ key })
          return doc ? doc.value : null
        } catch (e) {
          console.error(`[MONGO] Get metadata error:`, e.message)
          return null
        }
      },
      
      async cleanup() {
        try {
          const result = await Msg.deleteMany({ ts: { $lt: Date.now() - TTL_MS } })
          if (result.deletedCount > 0) {
            console.log(`[MONGO] Cleaned up ${result.deletedCount} old messages`)
          }
        } catch (e) {
          console.error('[MONGO] Cleanup error:', e.message)
        }
      },
      
      async close() {
        try {
          await mongoose.connection.close()
          console.log('[MONGO] Connection closed')
        } catch (e) {
          console.error('[MONGO] Close error:', e.message)
        }
      }
    }
    
    backend = 'mongo'
    messageLimit = MESSAGE_LIMITS.mongo
    console.log('[STORE] MongoDB enabled - Unlimited message storage')
  } catch (e) {
    console.warn('[STORE] MongoDB initialization failed:', e.message)
  }
}

/**
* ----------------- PostgreSQL -----------------
*/

if (backend === 'memory' && POSTGRES_URL) {
  try {
    const { Pool } = require('pg')
    const pool = new Pool({ 
      connectionString: POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      min: 2,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000
    })
    
    pool.on('error', (err) => {
      console.error('[POSTGRES] Pool error:', err.message)
    })
    
    adapters.postgres = {
      initialized: false,
      
      async init() {
        if (this.initialized) return
        try {
          const client = await pool.connect()
          try {
            await client.query(`
              CREATE TABLE IF NOT EXISTS messages (
                jid TEXT NOT NULL,
                id TEXT PRIMARY KEY,
                ts BIGINT NOT NULL,
                data BYTEA NOT NULL
              )
            `)
            await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_jid ON messages(jid)`)
            await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages(ts)`)
            
            await client.query(`
              CREATE TABLE IF NOT EXISTS message_counts (
                chat_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                count INTEGER DEFAULT 0,
                PRIMARY KEY (chat_id, user_id)
              )
            `)
            
            await client.query(`
              CREATE TABLE IF NOT EXISTS metadata (
                key TEXT PRIMARY KEY,
                value TEXT
              )
            `)
            
            this.initialized = true
            console.log('[POSTGRES] Connected and tables ready')
          } finally {
            client.release()
          }
        } catch (e) {
          console.error('[POSTGRES] Init error:', e.message)
          throw e
        }
      },
      
      async save(jid, id, msg) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            await client.query(
              `INSERT INTO messages(jid,id,ts,data) VALUES($1,$2,$3,$4)
               ON CONFLICT (id) DO UPDATE SET data=$4, ts=$3`,
              [jid, id, Date.now(), compress(msg)]
            )
          } finally {
            client.release()
          }
        } catch (e) {
          console.error(`[POSTGRES] Save error:`, e.message)
        }
      },
      
      async load(jid, id) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            const res = await client.query(
              `SELECT data FROM messages WHERE jid=$1 AND id=$2`,
              [jid, id]
            )
            return res.rows[0] ? decompress(res.rows[0].data) : null
          } finally {
            client.release()
          }
        } catch (e) {
          console.error(`[POSTGRES] Load error:`, e.message)
          return null
        }
      },
      
      async incrementCount(chatId, userId) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            await client.query(
              `INSERT INTO message_counts(chat_id, user_id, count) VALUES($1,$2,1)
               ON CONFLICT (chat_id, user_id) DO UPDATE SET count = message_counts.count + 1`,
              [chatId, userId]
            )
          } finally {
            client.release()
          }
        } catch (e) {
          console.error('[POSTGRES] Increment count error:', e.message)
        }
      },
      
      async getCount(chatId, userId) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            const res = await client.query(
              `SELECT count FROM message_counts WHERE chat_id=$1 AND user_id=$2`,
              [chatId, userId]
            )
            return res.rows[0] ? res.rows[0].count : 0
          } finally {
            client.release()
          }
        } catch (e) {
          console.error('[POSTGRES] Get count error:', e.message)
          return 0
        }
      },
      
      async getAllCounts() {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            const res = await client.query(`SELECT chat_id, user_id, count FROM message_counts`)
            const result = { isPublic: true, messageCount: {} }
            res.rows.forEach(row => {
              if (!result.messageCount[row.chat_id]) {
                result.messageCount[row.chat_id] = {}
              }
              result.messageCount[row.chat_id][row.user_id] = row.count
            })
            const metaRes = await client.query(`SELECT value FROM metadata WHERE key='isPublic'`)
            if (metaRes.rows[0]) result.isPublic = metaRes.rows[0].value === 'true'
            return result
          } finally {
            client.release()
          }
        } catch (e) {
          console.error('[POSTGRES] Get all counts error:', e.message)
          return { isPublic: true, messageCount: {} }
        }
      },
      
      async setPublicMode(isPublic) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            await client.query(
              `INSERT INTO metadata(key, value) VALUES('isPublic', $1)
               ON CONFLICT (key) DO UPDATE SET value=$1`,
              [isPublic.toString()]
            )
          } finally {
            client.release()
          }
        } catch (e) {
          console.error('[POSTGRES] Set public mode error:', e.message)
        }
      },

      async setMetadata(key, value) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            await client.query(
              `INSERT INTO metadata(key, value) VALUES($1, $2)
               ON CONFLICT (key) DO UPDATE SET value=$2`,
              [key, value.toString()]
            )
          } finally {
            client.release()
          }
        } catch (e) {
          console.error(`[POSTGRES] Set metadata error:`, e.message)
        }
      },

      async getMetadata(key) {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            const res = await client.query(`SELECT value FROM metadata WHERE key=$1`, [key])
            return res.rows[0] ? res.rows[0].value : null
          } finally {
            client.release()
          }
        } catch (e) {
          console.error(`[POSTGRES] Get metadata error:`, e.message)
          return null
        }
      },
      
      async cleanup() {
        try {
          await this.init()
          const client = await pool.connect()
          try {
            const res = await client.query(
              `DELETE FROM messages WHERE ts < $1`,
              [Date.now() - TTL_MS]
            )
            if (res.rowCount > 0) {
              console.log(`[POSTGRES] Cleaned up ${res.rowCount} old messages`)
            }
            // Note: Message counts are NEVER deleted - kept forever for ranks
          } finally {
            client.release()
          }
        } catch (e) {
          console.error('[POSTGRES] Cleanup error:', e.message)
        }
      },
      
      async close() {
        try {
          await pool.end()
          console.log('[POSTGRES] Pool closed')
        } catch (e) {
          console.error('[POSTGRES] Close error:', e.message)
        }
      }
    }
    
    backend = 'postgres'
    messageLimit = MESSAGE_LIMITS.postgres
    console.log('[STORE] PostgreSQL enabled - Unlimited message storage')
  } catch (e) {
    console.warn('[STORE] PostgreSQL initialization failed:', e.message)
  }
}

/**
 * ----------------- MySQL -----------------
*/

if (backend === 'memory' && MYSQL_URL) {
  try {
    const mysql = require('mysql2/promise')
    let mysqlConn = null
    let connectPromise = null
    
    adapters.mysql = {
      async getConn() {
        if (mysqlConn) return mysqlConn
        if (connectPromise) return connectPromise
        
        connectPromise = (async () => {
          try {
            mysqlConn = await mysql.createConnection(MYSQL_URL)
            await mysqlConn.execute(`
              CREATE TABLE IF NOT EXISTS messages (
                jid VARCHAR(255) NOT NULL,
                id VARCHAR(255) PRIMARY KEY,
                ts BIGINT NOT NULL,
                data LONGBLOB NOT NULL,
                INDEX idx_jid (jid),
                INDEX idx_ts (ts)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `)
            await mysqlConn.execute(`
              CREATE TABLE IF NOT EXISTS message_counts (
                chat_id VARCHAR(255) NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                count INT DEFAULT 0,
                PRIMARY KEY (chat_id, user_id)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `)
            await mysqlConn.execute(`
              CREATE TABLE IF NOT EXISTS metadata (
                \`key\` VARCHAR(255) PRIMARY KEY,
                value TEXT
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `)
            console.log('[MYSQL] Connection established and tables ready')
            return mysqlConn
          } catch (e) {
            console.error('[MYSQL] Connection error:', e.message)
            connectPromise = null
            throw e
          }
        })()
        
        return connectPromise
      },
      
      async save(jid, id, msg) {
        try {
          const conn = await this.getConn()
          await conn.execute(
            `INSERT INTO messages(jid,id,ts,data) VALUES(?,?,?,?)
             ON DUPLICATE KEY UPDATE data=VALUES(data), ts=VALUES(ts)`,
            [jid, id, Date.now(), compress(msg)]
          )
        } catch (e) {
          console.error(`[MYSQL] Save error:`, e.message)
        }
      },
      
      async load(jid, id) {
        try {
          const conn = await this.getConn()
          const [rows] = await conn.execute(
            `SELECT data FROM messages WHERE jid=? AND id=?`,
            [jid, id]
          )
          return rows[0] ? decompress(rows[0].data) : null
        } catch (e) {
          console.error(`[MYSQL] Load error:`, e.message)
          return null
        }
      },
      
      async incrementCount(chatId, userId) {
        try {
          const conn = await this.getConn()
          await conn.execute(
            `INSERT INTO message_counts(chat_id, user_id, count) VALUES(?,?,1)
             ON DUPLICATE KEY UPDATE count = count + 1`,
            [chatId, userId]
          )
        } catch (e) {
          console.error('[MYSQL] Increment count error:', e.message)
        }
      },
      
      async getCount(chatId, userId) {
        try {
          const conn = await this.getConn()
          const [rows] = await conn.execute(
            `SELECT count FROM message_counts WHERE chat_id=? AND user_id=?`,
            [chatId, userId]
          )
          return rows[0] ? rows[0].count : 0
        } catch (e) {
          console.error('[MYSQL] Get count error:', e.message)
          return 0
        }
      },
      
      async getAllCounts() {
        try {
          const conn = await this.getConn()
          const [rows] = await conn.execute(`SELECT chat_id, user_id, count FROM message_counts`)
          const result = { isPublic: true, messageCount: {} }
          rows.forEach(row => {
            if (!result.messageCount[row.chat_id]) {
              result.messageCount[row.chat_id] = {}
            }
            result.messageCount[row.chat_id][row.user_id] = row.count
          })
          const [metaRows] = await conn.execute(`SELECT value FROM metadata WHERE \`key\`='isPublic'`)
          if (metaRows[0]) result.isPublic = metaRows[0].value === 'true'
          return result
        } catch (e) {
          console.error('[MYSQL] Get all counts error:', e.message)
          return { isPublic: true, messageCount: {} }
        }
      },
      
      async setPublicMode(isPublic) {
        try {
          const conn = await this.getConn()
          await conn.execute(
            `INSERT INTO metadata(\`key\`, value) VALUES('isPublic', ?)
             ON DUPLICATE KEY UPDATE value=VALUES(value)`,
            [isPublic.toString()]
          )
        } catch (e) {
          console.error('[MYSQL] Set public mode error:', e.message)
        }
      },

      async setMetadata(key, value) {
        try {
          const conn = await this.getConn()
          await conn.execute(
            `INSERT INTO metadata(\`key\`, value) VALUES(?, ?)
             ON DUPLICATE KEY UPDATE value=VALUES(value)`,
            [key, value.toString()]
          )
        } catch (e) {
          console.error(`[MYSQL] Set metadata error:`, e.message)
        }
      },

      async getMetadata(key) {
        try {
          const conn = await this.getConn()
          const [rows] = await conn.execute(`SELECT value FROM metadata WHERE \`key\`=?`, [key])
          return rows[0] ? rows[0].value : null
        } catch (e) {
          console.error(`[MYSQL] Get metadata error:`, e.message)
          return null
        }
      },
      
      async cleanup() {
        try {
          const conn = await this.getConn()
          const [result] = await conn.execute(
            `DELETE FROM messages WHERE ts < ?`,
            [Date.now() - TTL_MS]
          )
          if (result.affectedRows > 0) {
            console.log(`[MYSQL] Cleaned up ${result.affectedRows} old messages`)
          }
        } catch (e) {
          console.error('[MYSQL] Cleanup error:', e.message)
        }
      },
      
      async close() {
        try {
          if (mysqlConn) {
            await mysqlConn.end()
            mysqlConn = null
            console.log('[MYSQL] Connection closed')
          }
        } catch (e) {
          console.error('[MYSQL] Close error:', e.message)
        }
      }
    }
    
    backend = 'mysql'
    messageLimit = MESSAGE_LIMITS.mysql
    console.log('[STORE] MySQL enabled - Unlimited message storage')
  } catch (e) {
    console.warn('[STORE] MySQL initialization failed:', e.message)
  }
}

/**
* ----------------- SQLite -----------------
*/

if (backend === 'memory') {
  try {
    const Database = require('better-sqlite3')
    const dir = path.dirname(SQLITE_URL)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    
    const sqlite = new Database(SQLITE_URL)
    sqlite.pragma('journal_mode = WAL')
    sqlite.pragma('synchronous = NORMAL')
    sqlite.pragma('cache_size = -64000')
    sqlite.pragma('temp_store = MEMORY')
    
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS messages (
        jid TEXT NOT NULL,
        id TEXT PRIMARY KEY,
        ts INTEGER NOT NULL,
        data BLOB NOT NULL
      )
    `).run()
    
    sqlite.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_jid ON messages(jid)`).run()
    sqlite.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages(ts)`).run()
    
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS message_counts (
        chat_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        count INTEGER DEFAULT 0,
        PRIMARY KEY (chat_id, user_id)
      )
    `).run()
    
    sqlite.prepare(`
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run()
    
    const saveStmt = sqlite.prepare(`INSERT OR REPLACE INTO messages VALUES (?,?,?,?)`)
    const loadStmt = sqlite.prepare(`SELECT data FROM messages WHERE jid=? AND id=?`)
    const cleanupStmt = sqlite.prepare(`DELETE FROM messages WHERE ts < ?`)
    const countStmt = sqlite.prepare(`SELECT COUNT(*) as count FROM messages WHERE jid=?`)
    const deleteOldestStmt = sqlite.prepare(`
      DELETE FROM messages WHERE jid=? AND id IN (
        SELECT id FROM messages WHERE jid=? ORDER BY ts ASC LIMIT ?
      )
    `)
    
    const incrementCountStmt = sqlite.prepare(`
      INSERT INTO message_counts(chat_id, user_id, count) VALUES(?,?,1)
      ON CONFLICT(chat_id, user_id) DO UPDATE SET count = count + 1
    `)
    const getCountStmt = sqlite.prepare(`SELECT count FROM message_counts WHERE chat_id=? AND user_id=?`)
    const getAllCountsStmt = sqlite.prepare(`SELECT chat_id, user_id, count FROM message_counts`)
    const getMetaStmt = sqlite.prepare(`SELECT value FROM metadata WHERE key='isPublic'`)
    const setMetaStmt = sqlite.prepare(`INSERT OR REPLACE INTO metadata(key, value) VALUES('isPublic', ?)`)
    const getMetadataStmt = sqlite.prepare(`SELECT value FROM metadata WHERE key=?`)
    const setMetadataStmt = sqlite.prepare(`INSERT OR REPLACE INTO metadata(key, value) VALUES(?, ?)`)
    
    adapters.sqlite = {
      save(jid, id, msg) {
        try {
          saveStmt.run(jid, id, Date.now(), compress(msg))
          
          const { count } = countStmt.get(jid)
          if (count > MESSAGE_LIMITS.sqlite) {
            const toDelete = count - MESSAGE_LIMITS.sqlite
            deleteOldestStmt.run(jid, jid, toDelete)
          }
        } catch (e) {
          console.error(`[SQLITE] Save error:`, e.message)
        }
      },
      
      load(jid, id) {
        try {
          const row = loadStmt.get(jid, id)
          return row ? decompress(row.data) : null
        } catch (e) {
          console.error(`[SQLITE] Load error:`, e.message)
          return null
        }
      },
      
      incrementCount(chatId, userId) {
        try {
          incrementCountStmt.run(chatId, userId)
        } catch (e) {
          console.error('[SQLITE] Increment count error:', e.message)
        }
      },
      
      getCount(chatId, userId) {
        try {
          const row = getCountStmt.get(chatId, userId)
          return row ? row.count : 0
        } catch (e) {
          console.error('[SQLITE] Get count error:', e.message)
          return 0
        }
      },
      
      getAllCounts() {
        try {
          const rows = getAllCountsStmt.all()
          const result = { isPublic: true, messageCount: {} }
          rows.forEach(row => {
            if (!result.messageCount[row.chat_id]) {
              result.messageCount[row.chat_id] = {}
            }
            result.messageCount[row.chat_id][row.user_id] = row.count
          })
          const metaRow = getMetaStmt.get()
          if (metaRow) result.isPublic = metaRow.value === 'true'
          return result
        } catch (e) {
          console.error('[SQLITE] Get all counts error:', e.message)
          return { isPublic: true, messageCount: {} }
        }
      },
      
      setPublicMode(isPublic) {
        try {
          setMetaStmt.run(isPublic.toString())
        } catch (e) {
          console.error('[SQLITE] Set public mode error:', e.message)
        }
      },

      setMetadata(key, value) {
        try {
          setMetadataStmt.run(key, value.toString())
        } catch (e) {
          console.error(`[SQLITE] Set metadata error:`, e.message)
        }
      },

      getMetadata(key) {
        try {
          const row = getMetadataStmt.get(key)
          return row ? row.value : null
        } catch (e) {
          console.error(`[SQLITE] Get metadata error:`, e.message)
          return null
        }
      },
      
      cleanup() {
        try {
          const result = cleanupStmt.run(Date.now() - TTL_MS)
          if (result.changes > 0) {
            console.log(`[SQLITE] Cleaned up ${result.changes} old messages`)
          }
          // Note: Message counts are NEVER deleted - kept forever for ranks
        } catch (e) {
          console.error('[SQLITE] Cleanup error:', e.message)
        }
      },
      
      close() {
        try {
          sqlite.close()
          console.log('[SQLITE] Database closed')
        } catch (e) {
          console.error('[SQLITE] Close error:', e.message)
        }
      }
    }
    
    backend = 'sqlite'
    messageLimit = MESSAGE_LIMITS.sqlite
    console.log(`[STORE] SQLite enabled - Max ${MESSAGE_LIMITS.sqlite} messages per chat`)
  } catch (e) {
    console.warn('[STORE] SQLite initialization failed:', e.message)
  }
}

/**
* STORE OBJECT (MAIN)
*/

const store = {
  messages: {},
  contacts: {},
  chats: {},
  messageCount: {},
  isPublic: true,
  botMode: 'public',

  readFromFile(filePath = STORE_FILE) {
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        this.contacts = data.contacts || {}
        this.chats = data.chats || {}
        this.botMode = data.botMode || 'public'
        
        if (backend === 'memory') {
          this.messages = data.messages || {}
          this.cleanupData()
          console.log('[STORE] Loaded from file (memory mode)')
        } else {
          console.log('[STORE] Loaded contacts and chats from file')
        }
      }
    } catch (e) {
      console.warn('[STORE] Failed to read store file:', e.message)
    }
    
    this.loadMessageCounts()
  },

  writeToFile(filePath = STORE_FILE) {
    try {
      const data = {
        contacts: this.contacts,
        chats: this.chats,
        botMode: this.botMode || 'public'
      }
      
      if (backend === 'memory') {
        data.messages = this.messages
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    } catch (e) {
      console.warn('[STORE] Failed to write store file:', e.message)
    }
    
    this.saveMessageCounts()
  },

  loadMessageCounts() {
    if (backend === 'memory') {
      try {
        if (fs.existsSync(MESSAGE_COUNT_FILE)) {
          const data = JSON.parse(fs.readFileSync(MESSAGE_COUNT_FILE, 'utf-8'))
          this.messageCount = data.messageCount || data
          this.isPublic = typeof data.isPublic === 'boolean' ? data.isPublic : true
          console.log('[STORE] Loaded message counts from file')
        }
      } catch (e) {
        console.warn('[STORE] Failed to read message count file:', e.message)
      }
    }
  },

  saveMessageCounts() {
    if (backend === 'memory') {
      try {
        const dir = path.dirname(MESSAGE_COUNT_FILE)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        
        const data = {
          isPublic: this.isPublic,
          messageCount: this.messageCount
        }
        fs.writeFileSync(MESSAGE_COUNT_FILE, JSON.stringify(data, null, 2))
      } catch (e) {
        console.warn('[STORE] Failed to write message count file:', e.message)
      }
    }
  },

  cleanupData() {
    if (this.messages && backend === 'memory') {
      Object.keys(this.messages).forEach(jid => {
        if (typeof this.messages[jid] === 'object' && !Array.isArray(this.messages[jid])) {
          const messages = Object.values(this.messages[jid])
          this.messages[jid] = messages.slice(-MAX_MESSAGES)
        } else if (Array.isArray(this.messages[jid])) {
          if (this.messages[jid].length > MAX_MESSAGES) {
            this.messages[jid] = this.messages[jid].slice(-MAX_MESSAGES)
          }
        }
      })
    }

    if (this.chats) {
      Object.keys(this.chats).forEach(chatId => {
        if (this.chats[chatId].messages) {
          delete this.chats[chatId].messages
        }
      })
    }
  },

  bind(ev) {
    ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.key?.remoteJid) continue
        
        const jid = msg.key.remoteJid
        const slim = slimMessage(msg)
        
        if (backend === 'memory') {
          this.messages[jid] = this.messages[jid] || []
          this.messages[jid].push(slim)
          
          if (this.messages[jid].length > MAX_MESSAGES) {
            this.messages[jid] = this.messages[jid].slice(-MAX_MESSAGES)
          }
        } else {
          try {
            await adapters[backend].save(jid, msg.key.id, slim)
          } catch (e) {
            console.error(`[STORE] Failed to save message ${msg.key.id}:`, e.message)
          }
        }
      }
    })

    ev.on('contacts.update', (contacts) => {
      contacts.forEach(contact => {
        if (contact.id) {
          this.contacts[contact.id] = {
            id: contact.id,
            name: contact.notify || contact.name || contact.verifiedName || ''
          }
        }
      })
    })

    ev.on('contacts.set', (contacts) => {
      contacts.forEach(contact => {
        if (contact.id) {
          this.contacts[contact.id] = {
            id: contact.id,
            name: contact.notify || contact.name || contact.verifiedName || ''
          }
        }
      })
    })

    ev.on('chats.set', (chats) => {
      chats.forEach(chat => {
        if (chat.id) {
          this.chats[chat.id] = {
            id: chat.id,
            name: chat.name || chat.subject || '',
            conversationTimestamp: chat.conversationTimestamp,
            unreadCount: chat.unreadCount || 0
          }
        }
      })
    })

    ev.on('chats.update', (chats) => {
      chats.forEach(chat => {
        if (chat.id) {
          const existing = this.chats[chat.id] || {}
          this.chats[chat.id] = {
            id: chat.id,
            name: chat.name || chat.subject || existing.name || '',
            conversationTimestamp: chat.conversationTimestamp || existing.conversationTimestamp,
            unreadCount: chat.unreadCount !== undefined ? chat.unreadCount : existing.unreadCount
          }
        }
      })
    })

    ev.on('chats.delete', (chats) => {
      chats.forEach(chatId => {
        delete this.chats[chatId]
        if (backend === 'memory') {
          delete this.messages[chatId]
        }
      })
    })
  },

  async loadMessage(jid, id) {
    if (backend === 'memory') {
      const msg = this.messages[jid]?.find(m => m.key.id === id) || null
      return msg
    } else {
      try {
        return await adapters[backend].load(jid, id)
      } catch (e) {
        console.error(`[STORE] Failed to load message ${id}:`, e.message)
        return null
      }
    }
  },

  /**
  * BOT MODE METHODS (Advanced)
  */
  
  async setBotMode(mode) {
    const validModes = ['public', 'private', 'groups', 'inbox', 'self']
    if (!validModes.includes(mode)) {
      console.warn(`[STORE] Invalid mode: ${mode}, defaulting to public`)
      mode = 'public'
    }

    if (backend === 'memory') {
      this.botMode = mode
    } else {
      try {
        await adapters[backend].setMetadata('botMode', mode)
      } catch (e) {
        console.error(`[STORE] Failed to set bot mode:`, e.message)
      }
    }
  },

  async getBotMode() {
    if (backend === 'memory') {
      return this.botMode || 'public'
    } else {
      try {
        const mode = await adapters[backend].getMetadata('botMode')
        return mode || 'public'
      } catch (e) {
        console.error(`[STORE] Failed to get bot mode:`, e.message)
        return 'public'
      }
    }
  },
  
  async incrementMessageCount(chatId, userId) {
    if (backend === 'memory') {
      if (!this.messageCount[chatId]) {
        this.messageCount[chatId] = {}
      }
      if (!this.messageCount[chatId][userId]) {
        this.messageCount[chatId][userId] = 0
      }
      this.messageCount[chatId][userId]++
    } else {
      try {
        await adapters[backend].incrementCount(chatId, userId)
      } catch (e) {
        console.error(`[STORE] Failed to increment count for ${userId}:`, e.message)
      }
    }
  },

  async getMessageCount(chatId, userId) {
    if (backend === 'memory') {
      return this.messageCount[chatId]?.[userId] || 0
    } else {
      try {
        return await adapters[backend].getCount(chatId, userId)
      } catch (e) {
        console.error(`[STORE] Failed to get count for ${userId}:`, e.message)
        return 0
      }
    }
  },

  async getAllMessageCounts() {
    if (backend === 'memory') {
      return {
        isPublic: this.isPublic,
        messageCount: this.messageCount
      }
    } else {
      try {
        return await adapters[backend].getAllCounts()
      } catch (e) {
        console.error(`[STORE] Failed to get all counts:`, e.message)
        return { isPublic: true, messageCount: {} }
      }
    }
  },

  async setPublicMode(isPublic) {
    if (backend === 'memory') {
      this.isPublic = isPublic
    } else {
      try {
        await adapters[backend].setPublicMode(isPublic)
      } catch (e) {
        console.error(`[STORE] Failed to set public mode:`, e.message)
      }
    }
  },

  async getPublicMode() {
    if (backend === 'memory') {
      return this.isPublic
    } else {
      try {
        const data = await adapters[backend].getAllCounts()
        return data.isPublic
      } catch (e) {
        console.error(`[STORE] Failed to get public mode:`, e.message)
        return true
      }
    }
  },

  /**
  * Get store statistics
  */
  
  getStats() {
    let totalMessages = 0
    let totalContacts = Object.keys(this.contacts).length
    let totalChats = Object.keys(this.chats).length
    let totalMessageCounts = 0
    
    if (backend === 'memory') {
      Object.values(this.messages).forEach(chatMessages => {
        if (Array.isArray(chatMessages)) {
          totalMessages += chatMessages.length
        }
      })
      
      Object.values(this.messageCount).forEach(chatCounts => {
        if (typeof chatCounts === 'object') {
          totalMessageCounts += Object.keys(chatCounts).length
        }
      })
    }
    
    return {
      backend,
      messages: backend === 'memory' ? totalMessages : 'stored in database',
      contacts: totalContacts,
      chats: totalChats,
      messageCounts: backend === 'memory' ? totalMessageCounts : 'stored in database',
      maxMessagesPerChat: messageLimit === Infinity ? 'unlimited' : messageLimit,
      isPublic: this.isPublic,
      botMode: this.botMode
    }
  }
}

/**
* LIFECYCLE MANAGEMENT
*/

if (backend !== 'memory') {
  setTimeout(() => {
    if (adapters[backend].cleanup) {
      Promise.resolve(adapters[backend].cleanup()).catch(err => 
        console.error('[STORE] Initial cleanup error:', err)
      )
    }
  }, 5 * 60 * 1000)
  
  cleanupTimer = setInterval(() => {
    if (adapters[backend].cleanup) {
      Promise.resolve(adapters[backend].cleanup()).catch(err => 
        console.error('[STORE] Periodic cleanup error:', err)
      )
    }
  }, CLEANUP_INTERVAL)
}

if (backend === 'memory') {
  setInterval(() => {
    store.writeToFile()
  }, 5 * 60 * 1000)
}

setInterval(() => {
  if (store.chats) {
    let cleaned = 0
    Object.keys(store.chats).forEach(chatId => {
      if (store.chats[chatId].messages) {
        delete store.chats[chatId].messages
        cleaned++
      }
    })
    if (cleaned > 0) {
      console.log(`[STORE] Cleaned messages from ${cleaned} chats`)
    }
  }
}, 60 * 1000)

const gracefulShutdown = async (signal) => {
  console.log(`[STORE] Received ${signal}, shutting down gracefully...`)
  
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
  
  if (backend === 'memory') {
    store.writeToFile()
  }
  
  if (backend !== 'memory' && adapters[backend].close) {
    try {
      await adapters[backend].close()
    } catch (e) {
      console.error('[STORE] Error during shutdown:', e.message)
    }
  }
  
  console.log('[STORE] Shutdown complete')
}

process.on('SIGINT', async () => {
  await gracefulShutdown('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await gracefulShutdown('SIGTERM')
  process.exit(0)
})

process.on('beforeExit', async () => {
  if (backend === 'memory') {
    store.writeToFile()
  }
})

process.on('uncaughtException', (err) => {
  console.error('[STORE] Uncaught exception:', err)
  if (backend === 'memory') {
    store.writeToFile()
  }
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('[STORE] Unhandled rejection at:', promise, 'reason:', reason)
})

console.log(`[STORE] Initialized with backend: ${backend}`)
console.log(`[STORE] Message limit per chat: ${messageLimit === Infinity ? 'unlimited' : messageLimit}`)

module.exports = store;


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
 

