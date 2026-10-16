import { simpleGit } from 'simple-git';
export default {
    command: 'gitpull',
    aliases: ['refresh', 'pull'],
    category: 'owner',
    description: 'Reload all plugins (Pull changes from git if available)',
    usage: '.gitpull',
    ownerOnly: true,
    async handler(sock, message) {
        const chatId = message.key.remoteJid;
        const commandHandler = (await import('../lib/commandHandler.js')).default;
        const git = simpleGit();
        const start = Date.now();
        let gitStatus = 'Local reload only';
        try {
            const isRepo = await git.checkIsRepo();
            if (isRepo) {
                const remotes = await git.getRemotes(true);
                if (remotes.some((r) => r.name === 'origin')) {
                    await git.pull();
                    gitStatus = 'Pulled from git remote';
                }
            }
        }
        catch (err) {
            gitStatus = 'Git unavailable, used local files';
        }
        try {
            commandHandler.reloadCommands();
            const end = Date.now();
            await sock.sendMessage(chatId, {
                text: `✅ Reload complete\n` +
                    `🔄 Mode: ${gitStatus}\n` +
                    `📦 Plugins: ${commandHandler.commands.size}\n` +
                    `⏱ Time: ${end - start}ms`
            });
        }
        catch (error) {
            await sock.sendMessage(chatId, {
                text: `❌ Reload failed: ${error.message}`
            });
        }
    }
};
