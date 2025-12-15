const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
◈╭──❍「 *BOT INFO* 」❍
◈├¤⁠   *🤖 ${settings.botName || 'MEGA-MD'}*  
◈├¤⁠   *Version: ${settings.version || '5.0.0'}*
◈├¤⁠   *Author: ${settings.botOwner || 'GlobalTechInfo'}*
◈├¤⁠   *YT : ${global.ytch}*
◈╰───★─☆──♪♪─❍

◈╭──❍「 *GENERAL* 」❍
◈├¤⁠  *.help*
◈├¤  *.menu*
◈├¤⁠  *.ping*
◈├¤⁠  *.alive*
◈├¤⁠  *.tts*
◈├¤⁠  *.owner*
◈├¤⁠  *.joke*
◈├¤⁠  *.quote*
◈├¤⁠  *.fact*
◈├¤⁠  *.weather*
◈├¤⁠  *.news*
◈├¤⁠  *.attp*
◈├¤⁠  *.lyrics*
◈├¤⁠  *.8ball*
◈├¤⁠  *.groupinfo*
◈├¤⁠  *.staff*
◈├¤  *.admins*
◈├¤⁠  *.vv*
◈├¤⁠  *.trt*
◈├¤⁠  *.ss*
◈├¤⁠  *.jid*
◈├¤⁠  *.url*
◈├¤⁠  *.teddy*
◈├¤⁠  *.wiki*
◈├¤⁠  *.trends*
◈├¤⁠  *.upload*
◈├¤⁠  *.notes*
◈├¤⁠  *.fancytext*
◈├¤⁠  *.wattpad*
◈├¤⁠  *.readmore*
◈├¤⁠  *.tiny*
◈├¤⁠  *.bing*
◈├¤⁠  *.element*
◈├¤⁠  *.an1apk*
◈├¤⁠  *.define*
◈├¤⁠  *.base64*
◈├¤⁠  *.walink*
◈├¤⁠  *.pokedex*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🧑‍💻 ADMINS* 」❍
◈├¤⁠  *.ban*
◈├¤⁠  *.promote*
◈├¤⁠  *.demote*
◈├¤⁠  *.mute*
◈├¤⁠  *.unmute*
◈├¤⁠  *.delete*
◈├¤⁠  *.kick*
◈├¤⁠  *.warnings*
◈├¤⁠  *.warn*
◈├¤⁠  *.antilink*
◈├¤⁠  *.antibadword*
◈├¤⁠  *.clear*
◈├¤⁠  *.tag*
◈├¤⁠  *.tagall*
◈├¤⁠  *.tagnotadmin*
◈├¤⁠  *.hidetag*
◈├¤⁠  *.chatbot*
◈├¤⁠  *.resetlink*
◈├¤⁠  *.antitag*
◈├¤⁠  *.welcome*
◈├¤⁠  *.goodbye*
◈├¤⁠  *.setgdesc*
◈├¤⁠  *.setgname*
◈├¤⁠  *.setgpp*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *📊 OWNER* 」❍
◈├¤⁠  *.mode*
◈├¤⁠  *.autochat*
◈├¤⁠  *.clearsession*
◈├¤⁠  *.antidelete*
◈├¤⁠  *.cleartmp*
◈├¤⁠  *.update*
◈├¤⁠  *.settings*
◈├¤⁠  *.setpp*
◈├¤⁠  *.autoreact*
◈├¤⁠  *.cmdreact*
◈├¤⁠  *.autostatus*
◈├¤⁠  *.autostatus react*
◈├¤⁠  *.autotyping*
◈├¤⁠  *.autoread*
◈├¤⁠  *.anticall*
◈├¤⁠  *.pmblocker*
◈├¤⁠  *.pmblocker setmsg*
◈├¤⁠  *.setmention*
◈├¤⁠  *.mention*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🖼️ IMAGES* 」❍
◈├¤⁠  *.blur*
◈├¤⁠  *.simage*
◈├¤⁠  *.sticker*
◈├¤⁠  *.removebg*
◈├¤⁠  *.remini*
◈├¤⁠  *.crop*
◈├¤⁠  *.tgsticker*
◈├¤⁠  *.meme*
◈├¤⁠  *.take*
◈├¤⁠  *.emojimix*
◈├¤⁠  *.igs*
◈├¤⁠  *.igsc*
◈╰─┬─★─☆──♪♪─❍  
◈╭─┴❍「 *💃 PIES* 」❍
◈├¤⁠  *.pies*
◈├¤⁠  *.china*
◈├¤⁠  *.indonesia*
◈├¤⁠  *.japan*
◈├¤⁠  *.korea* 
◈├¤⁠  *.hijab*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🎮 GAMES* 」❍
◈├¤⁠  *.tictactoe*
◈├¤⁠  *.hangman*
◈├¤⁠  *.guess*
◈├¤⁠  *.trivia*
◈├¤⁠  *.answer*
◈├¤⁠  *.truth*
◈├¤⁠  *.dare*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🤖 AI* 」❍
◈├¤⁠  *.gpt*
◈├¤⁠  *.gemini*
◈├¤⁠  *.imagine*
◈├¤⁠  *.flux*
◈├¤⁠  *.sora*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🎭 FUN* 」❍
◈├¤⁠  *.compliment*
◈├¤⁠  *.insult*
◈├¤⁠  *.flirt*
◈├¤⁠  *.shayari*
◈├¤⁠  *.goodnight*
◈├¤⁠  *.roseday*
◈├¤⁠  *.character*
◈├¤⁠  *.wasted*
◈├¤⁠  *.ship*
◈├¤⁠  *.simp*
◈├¤⁠  *.stupid*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🏞️ MAKERS* 」❍
◈├¤⁠  *.metallic*
◈├¤⁠  *.ice*
◈├¤⁠  *.snow*
◈├¤⁠  *.impressive*
◈├¤⁠  *.matrix*
◈├¤⁠  *.light*
◈├¤⁠  *.neon*
◈├¤⁠  *.devil*
◈├¤⁠  *.purple*
◈├¤⁠  *.thunder*
◈├¤⁠  *.leaves*
◈├¤⁠  *.1917*
◈├¤⁠  *.arena*
◈├¤⁠  *.hacker*
◈├¤⁠  *.sand*
◈├¤⁠  *.blackpink*
◈├¤⁠  *.glitc*
◈├¤⁠  *.fire*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *DOWNLOADS* 」❍
◈├¤⁠  *.play*
◈├¤⁠  *.song*
◈├¤⁠  *.spotify*
◈├¤⁠  *.instagram*
◈├¤⁠  *.facebook*
◈├¤⁠  *.tiktok*
◈├¤⁠  *.video*
◈├¤⁠  *.ytmp4*
◈├¤⁠  *.imdb*
◈├¤⁠  *.itunes*
◈├¤⁠  *.shazam*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🖌️ CANVAS* 」❍
◈├¤⁠  *.heart*
◈├¤⁠  *.horny*
◈├¤⁠  *.circle*
◈├¤⁠  *.lgbt*
◈├¤⁠  *.lolice*
◈├¤⁠  *.its-so-stupid*
◈├¤⁠  *.namecard*
◈├¤⁠  *.oogway*
◈├¤⁠  *.tweet*
◈├¤⁠  *.ytcomment*
◈├¤⁠  *.comrade*
◈├¤⁠  *.gay*
◈├¤⁠  *.glass*
◈├¤⁠  *.jail*
◈├¤⁠  *.passed*
◈├¤⁠  *.triggered*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🎊 ANIMES* 」❍
◈├¤⁠  *.nom*
◈├¤⁠  *.poke*
◈├¤⁠  *.cry*
◈├¤⁠  *.kiss*
◈├¤⁠  *.pat*
◈├¤⁠  *.hug*
◈├¤⁠  *.wink*
◈├¤⁠  *.facepalm*
◈╰─┬─★─☆──♪♪─❍
◈╭─┴❍「 *🔗 GITHUB* 」❍
◈├¤⁠  *.git*
◈├¤⁠  *.github*
◈├¤⁠  *.sc*
◈├¤⁠  *.script*
◈├¤⁠  *.repo*
◈╰─♪♪─★─☆──♪♪─❍

*Join channel for updates:*`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363319098372999@newsletter',
                        newsletterName: 'MEGA MD',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
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
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
