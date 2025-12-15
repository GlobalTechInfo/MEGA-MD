require('./config')
require('./settings')

const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')

const store = require('./lib/lightweight_store')
const SaveCreds = require('./lib/session');
const { app, server, PORT } = require('./lib/server');
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }
}, 60_000)

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1)
    }
}, 30_000)

let phoneNumber = process.env.BOT_PHONE_NUMBER || "923051391005"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "MEGA AI"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

let rl = null
if (process.stdin.isTTY && !process.env.BOT_PHONE_NUMBER) {
    rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    })
}

const question = (text) => {
    if (rl && !rl.closed) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

process.on('exit', () => {
    if (rl && !rl.closed) {
        rl.close()
    }
})

process.on('SIGINT', () => {
    if (rl && !rl.closed) {
        rl.close()
    }
    process.exit(0)
})

function ensureSessionDirectory() {
    const sessionPath = path.join(__dirname, 'session')
    if (!existsSync(sessionPath)) {
        console.log(chalk.yellow('📁 Creating session directory...'))
        mkdirSync(sessionPath, { recursive: true })
        console.log(chalk.green('✅ Session directory created.'))
    }
    return sessionPath
}

function hasValidSession() {
    try {
        const credsPath = path.join(__dirname, 'session', 'creds.json')
        
        if (!existsSync(credsPath)) {
            return false
        }
        const fileContent = fs.readFileSync(credsPath, 'utf8')
        if (!fileContent || fileContent.trim().length === 0) {
            console.log(chalk.yellow('⚠️ creds.json exists but is empty'))
            return false
        }
        
        try {
            const creds = JSON.parse(fileContent)
            if (!creds.noiseKey || !creds.signedIdentityKey || !creds.signedPreKey) {
                console.log(chalk.yellow('⚠️ creds.json is missing required fields'))
                return false
            }
            if (creds.registered === false) {
                console.log(chalk.yellow('⚠️ Session credentials exist but are not registered (incomplete pairing)'))
                console.log(chalk.yellow('   Deleting unregistered session to allow fresh pairing...'))
                try {
                    rmSync(path.join(__dirname, 'session'), { recursive: true, force: true })
                } catch (e) {}
                return false
            }
            
            console.log(chalk.green('✅ Valid and registered session credentials found'))
            return true
        } catch (parseError) {
            console.log(chalk.yellow('⚠️ creds.json contains invalid JSON'))
            return false
        }
    } catch (error) {
        console.error(chalk.red('Error checking session validity:'), error.message)
        return false
    }
}

async function initializeSession() {
    ensureSessionDirectory()
    
    const txt = process.env.SESSION_ID

    if (!txt) {
        console.log(chalk.yellow('No SESSION_ID found in environment variables.'))
        if (hasValidSession()) {
            console.log(chalk.green('✅ Existing session found. Using saved credentials.'))
            return true
        }
        console.log(chalk.yellow('No existing session found. Pairing code will be required.'))
        return false
    }
    if (hasValidSession()) {
        console.log(chalk.green('✅ Session credentials already exist and are valid. Skipping download.'))
        return true
    }
    try {
        // console.log(chalk.yellow('📥 Downloading session from GIST...'))
        await SaveCreds(txt)
        await delay(2000)
        
        console.log(chalk.green('✅ Session credentials downloaded.'))
        
        if (hasValidSession()) {
            console.log(chalk.green('✅ Session file verified and valid.'))
            await delay(1000)
            return true
        } else {
            console.log(chalk.red('❌ Session file not valid after download.'))
            return false
        }
    } catch (error) {
        console.error(chalk.red('❌ Error downloading session:'), error.message)
        return false
    }
}
server.listen(PORT, () => {

	console.log(chalk.yellow('App listened on port', PORT));

});

async function startQasimDev() {
    try {
        let { version, isLatest } = await fetchLatestBaileysVersion()
        
        ensureSessionDirectory()
    
        await delay(1000)
        
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const hasRegisteredCreds = state.creds && state.creds.registered !== undefined
        console.log(chalk.cyan(`📋 Credentials loaded. Registered: ${state.creds?.registered || false}`))

        const QasimDev = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        QasimDev.ev.on('creds.update', saveCreds)

        store.bind(QasimDev.ev)

        QasimDev.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(QasimDev, chatUpdate);
                    return;
                }
                if (!QasimDev.public && !mek.key.fromMe && chatUpdate.type === 'notify') {
                    const isGroup = mek.key?.remoteJid?.endsWith('@g.us')
                    if (!isGroup) return
                }
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

                if (QasimDev?.msgRetryCounterCache) {
                    QasimDev.msgRetryCounterCache.clear()
                }

                try {
                    await handleMessages(QasimDev, chatUpdate, true)
                } catch (err) {
                    console.error("Error in handleMessages:", err)
                    if (mek.key && mek.key.remoteJid) {
                        await QasimDev.sendMessage(mek.key.remoteJid, {
                            text: '❌ An error occurred while processing your message.',
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363319098372999@newsletter',
                                    newsletterName: 'MEGA MD',
                                    serverMessageId: -1
                                }
                            }
                        }).catch(console.error);
                    }
                }
            } catch (err) {
                console.error("Error in messages.upsert:", err)
            }
        })

        QasimDev.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        QasimDev.ev.on('contacts.update', update => {
            for (let contact of update) {
                let id = QasimDev.decodeJid(contact.id)
                if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
            }
        })

        QasimDev.getName = (jid, withoutContact = false) => {
            id = QasimDev.decodeJid(jid)
            withoutContact = QasimDev.withoutContact || withoutContact
            let v
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {}
                if (!(v.name || v.subject)) v = QasimDev.groupMetadata(id) || {}
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
            })
            else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === QasimDev.decodeJid(QasimDev.user.id) ?
                QasimDev.user :
                (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        QasimDev.public = true

        QasimDev.serializeM = (m) => smsg(QasimDev, m, store)

        const isRegistered = state.creds?.registered === true
        
        if (pairingCode && !isRegistered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api')

            console.log(chalk.yellow('\n⚠️  Session not registered. Pairing code required.\n'))

            let phoneNumberInput
            if (!!global.phoneNumber) {
                phoneNumberInput = global.phoneNumber
            } else if (process.env.BOT_PHONE_NUMBER) {
                phoneNumberInput = process.env.BOT_PHONE_NUMBER
                console.log(chalk.yellow(`Using phone number from environment: ${phoneNumberInput}`))
            } else if (rl && !rl.closed) {
                phoneNumberInput = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 6281376552730 (without + or spaces) : `)))
            } else {
                phoneNumberInput = phoneNumber
                console.log(chalk.yellow(`Using default phone number: ${phoneNumberInput}`))
            }

            phoneNumberInput = phoneNumberInput.replace(/[^0-9]/g, '')

            const pn = require('awesome-phonenumber');
            if (!pn('+' + phoneNumberInput).isValid()) {
                console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 15551234567 for US, 447911123456 for UK, etc.) without + or spaces.'));
                
                // Close readline before exiting
                if (rl && !rl.closed) {
                    rl.close()
                }
                process.exit(1);
            }

            setTimeout(async () => {
                try {
                    let code = await QasimDev.requestPairingCode(phoneNumberInput)
                    code = code?.match(/.{1,4}/g)?.join("-") || code
                    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                    console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
                    
                    if (rl && !rl.closed) {
                        rl.close()
                        rl = null
                    }
                } catch (error) {
                    console.error('Error requesting pairing code:', error)
                    console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
                }
            }, 3000)
        } else if (isRegistered) {
            console.log(chalk.green('✅ Session is registered and ready to connect.'))
            // Close readline since we don't need it
            if (rl && !rl.closed) {
                rl.close()
                rl = null
            }
        } else {
            console.log(chalk.yellow('⚠️  Waiting for connection to establish...'))
            // Close readline
            if (rl && !rl.closed) {
                rl.close()
                rl = null
            }
        }

        QasimDev.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s
            
            if (qr) {
                console.log(chalk.yellow('📱 QR Code generated. Please scan with WhatsApp.'))
            }
            
            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
            }
            
            if (connection == "open") {
                console.log(chalk.magenta(` `))
                console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(QasimDev.user, null, 2)))

                try {
                    const botNumber = QasimDev.user.id.split(':')[0] + '@s.whatsapp.net';
                    await QasimDev.sendMessage(botNumber, {
                        text: `🤖 Bot Connected Successfully!\n\n⏰ Time: ${new Date().toLocaleString()}\n✅ Status: Online and Ready!\n\n✅Make sure to join below channel`,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363319098372999@newsletter',
                                newsletterName: 'MEGA MD',
                                serverMessageId: -1
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error sending connection message:', error.message)
                }

                await delay(1999)
                console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'MEGA AI'} ]`)}\n\n`))
                console.log(chalk.cyan(`< ================================================== >`))
                console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT CHANNEL: GlobalTechInfo`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: GlobalTechInfo`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} WA NUMBER: ${owner}`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: Qasim Ali`))
                console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected Successfully! ✅`))
                console.log(chalk.blue(`Bot Version: ${settings.version}`))
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                const statusCode = lastDisconnect?.error?.output?.statusCode
                
                console.log(chalk.red(`Connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}`))
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        rmSync('./session', { recursive: true, force: true })
                        console.log(chalk.yellow('Session folder deleted. Please re-authenticate.'))
                    } catch (error) {
                        console.error('Error deleting session:', error)
                    }
                    console.log(chalk.red('Session logged out. Please re-authenticate.'))
                }
                
                if (shouldReconnect) {
                    console.log(chalk.yellow('Reconnecting...'))
                    await delay(5000)
                    startQasimDev()
                }
            }
        })

        const antiCallNotified = new Set();

        QasimDev.ev.on('call', async (calls) => {
            try {
                const { readState: readAnticallState } = require('./plugins/anticall');
                const state = readAnticallState();
                if (!state.enabled) return;
                for (const call of calls) {
                    const callerJid = call.from || call.peerJid || call.chatId;
                    if (!callerJid) continue;
                    try {
                        try {
                            if (typeof QasimDev.rejectCall === 'function' && call.id) {
                                await QasimDev.rejectCall(call.id, callerJid);
                            } else if (typeof QasimDev.sendCallOfferAck === 'function' && call.id) {
                                await QasimDev.sendCallOfferAck(call.id, callerJid, 'reject');
                            }
                        } catch {}

                        if (!antiCallNotified.has(callerJid)) {
                            antiCallNotified.add(callerJid);
                            setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                            await QasimDev.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                        }
                    } catch {}
                    setTimeout(async () => {
                        try { await QasimDev.updateBlockStatus(callerJid, 'block'); } catch {}
                    }, 800);
                }
            } catch (e) {
                console.error('Error in anticall handler:', e)
            }
        });

        QasimDev.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(QasimDev, update);
        });

        QasimDev.ev.on('messages.upsert', async (m) => {
            if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
                await handleStatus(QasimDev, m);
            }
        });

        QasimDev.ev.on('status.update', async (status) => {
            await handleStatus(QasimDev, status);
        });

        QasimDev.ev.on('messages.reaction', async (status) => {
            await handleStatus(QasimDev, status);
        });

        return QasimDev
    } catch (error) {
        console.error('Error in startQasimDev:', error)
        
        if (rl && !rl.closed) {
            rl.close()
            rl = null
        }
        
        await delay(5000)
        startQasimDev()
    }
}
async function main() {
    console.log(chalk.cyan('\n🚀 Starting MEGA MD Bot...\n'))
    
    const sessionReady = await initializeSession()
    
    if (sessionReady) {
        console.log(chalk.green('✅ Session initialization complete. Starting bot...\n'))
    } else {
        console.log(chalk.yellow('⚠️  Session initialization incomplete. Will attempt pairing...\n'))
    }
    
    await delay(3000)
    
    startQasimDev().catch(error => {
        console.error('Fatal error:', error)
        
        if (rl && !rl.closed) {
            rl.close()
        }
        
        process.exit(1)
    })
}
main()

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})
server.on('error', (error) => {

	if (error.code === 'EADDRINUSE') {

		console.log(`Address localhost:${PORT} in use. Please retry when the port is available!`);

		server.close();

	} else console.error('Server error:', error);

})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
});

