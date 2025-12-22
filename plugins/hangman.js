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
 


const words = ['javascript', 'bot', 'hangman', 'whatsapp', 'nodejs', 'python', 'programming', 'developer', 'computer', 'algorithm'];
let hangmanGames = {};

function guessLetter(sock, chatId, letter) {
    if (!hangmanGames[chatId]) {
        sock.sendMessage(chatId, { text: '❌ *No game in progress*\n\nStart a new game with `.hangman`' });
        return;
    }

    const game = hangmanGames[chatId];
    const { word, guessedLetters, maskedWord, maxWrongGuesses } = game;

    if (guessedLetters.includes(letter)) {
        sock.sendMessage(chatId, { text: `⚠️ *You already guessed "${letter}"*\n\nTry another letter.` });
        return;
    }

    guessedLetters.push(letter);

    if (word.includes(letter)) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                maskedWord[i] = letter;
            }
        }
        sock.sendMessage(chatId, { text: `✅ *Good guess!*\n\n${maskedWord.join(' ')}` });

        if (!maskedWord.includes('_')) {
            sock.sendMessage(chatId, { text: `🎉 *Congratulations!*\n\nYou guessed the word: *${word}*` });
            delete hangmanGames[chatId];
        }
    } else {
        game.wrongGuesses += 1;
        sock.sendMessage(chatId, { text: `❌ *Wrong guess!*\n\nYou have *${maxWrongGuesses - game.wrongGuesses}* tries left.\n\n${maskedWord.join(' ')}` });

        if (game.wrongGuesses >= maxWrongGuesses) {
            sock.sendMessage(chatId, { text: `💀 *Game over!*\n\nThe word was: *${word}*` });
            delete hangmanGames[chatId];
        }
    }
}

module.exports = {
    command: 'hangman',
    aliases: ['hang', 'hm'],
    category: 'games',
    description: 'Play hangman word guessing game',
    usage: '.hangman to start, then .guess <letter>',

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        
        const word = words[Math.floor(Math.random() * words.length)];
        const maskedWord = '_ '.repeat(word.length).trim();

        hangmanGames[chatId] = {
            word,
            maskedWord: maskedWord.split(' '),
            guessedLetters: [],
            wrongGuesses: 0,
            maxWrongGuesses: 6,
        };

        await sock.sendMessage(chatId, { 
            text: `🎮 *HANGMAN GAME STARTED!*\n\n` +
                  `The word is: ${maskedWord}\n\n` +
                  `*How to play:*\n` +
                  `• Use \`.guess <letter>\` to guess\n` +
                  `• You have 6 wrong guesses allowed\n` +
                  `• Guess the word before running out of tries!\n\n` +
                  `Good luck! 🍀`
        }, { quoted: message });
    },

    guessLetter
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
 
