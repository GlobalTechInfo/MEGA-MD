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
 

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const settings = require('../settings');

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(new Error((stderr || stdout || err.message || '').toString()));
      resolve((stdout || '').toString());
    });
  });
}

async function hasGitRepo() {
  const gitDir = path.join(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) return false;
  try {
    await run('git --version');
    return true;
  } catch {
    return false;
  }
}

async function updateViaGit() {
  const oldRev = (await run('git rev-parse HEAD').catch(() => 'unknown')).trim();
  await run('git fetch --all --prune');
  const newRev = (await run('git rev-parse origin/main')).trim();
  const alreadyUpToDate = oldRev === newRev;
  const commits = alreadyUpToDate ? '' : await run(`git log --pretty=format:"%h %s (%an)" ${oldRev}..${newRev}`).catch(() => '');
  const files = alreadyUpToDate ? '' : await run(`git diff --name-status ${oldRev} ${newRev}`).catch(() => '');
  await run(`git reset --hard ${newRev}`);
  await run('git clean -fd');
  return { oldRev, newRev, alreadyUpToDate, commits, files };
}

function downloadFile(url, dest, visited = new Set()) {
  return new Promise((resolve, reject) => {
    try {
      if (visited.has(url) || visited.size > 5) {
        return reject(new Error('Too many redirects'));
      }
      visited.add(url);

      const useHttps = url.startsWith('https://');
      const client = useHttps ? require('https') : require('http');
      const req = client.get(url, {
        headers: {
          'User-Agent': 'MegaBot-Updater/1.0',
          'Accept': '*/*'
        }
      }, res => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers.location;
          if (!location) return reject(new Error(`HTTP ${res.statusCode} without Location`));
          const nextUrl = new URL(location, url).toString();
          res.resume();
          return downloadFile(nextUrl, dest, visited).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }

        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', err => {
          try { file.close(() => {}); } catch {}
          fs.unlink(dest, () => reject(err));
        });
      });
      req.on('error', err => {
        fs.unlink(dest, () => reject(err));
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function extractZip(zipPath, outDir) {
  if (process.platform === 'win32') {
    const cmd = `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${outDir.replace(/\\/g, '/')}' -Force"`;
    await run(cmd);
    return;
  }
  try {
    await run('command -v unzip');
    await run(`unzip -o '${zipPath}' -d '${outDir}'`);
    return;
  } catch {}
  try {
    await run('command -v 7z');
    await run(`7z x -y '${zipPath}' -o'${outDir}'`);
    return;
  } catch {}
  try {
    await run('busybox unzip -h');
    await run(`busybox unzip -o '${zipPath}' -d '${outDir}'`);
    return;
  } catch {}
  throw new Error("No system unzip tool found (unzip/7z/busybox). Git mode is recommended on this panel.");
}

function copyRecursive(src, dest, ignore = [], relative = '', outList = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (ignore.includes(entry)) continue;
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.lstatSync(s);
    if (stat.isDirectory()) {
      copyRecursive(s, d, ignore, path.join(relative, entry), outList);
    } else {
      fs.copyFileSync(s, d);
      if (outList) outList.push(path.join(relative, entry).replace(/\\/g, '/'));
    }
  }
}

async function updateViaZip(sock, chatId, message, zipOverride) {
  const zipUrl = (zipOverride || settings.updateZipUrl || process.env.UPDATE_ZIP_URL || '').trim();
  if (!zipUrl) {
    throw new Error('No ZIP URL configured. Set settings.updateZipUrl or UPDATE_ZIP_URL env.');
  }
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const zipPath = path.join(tmpDir, 'update.zip');
  await downloadFile(zipUrl, zipPath);
  const extractTo = path.join(tmpDir, 'update_extract');
  if (fs.existsSync(extractTo)) fs.rmSync(extractTo, { recursive: true, force: true });
  await extractZip(zipPath, extractTo);

  const [root] = fs.readdirSync(extractTo).map(n => path.join(extractTo, n));
  const srcRoot = fs.existsSync(root) && fs.lstatSync(root).isDirectory() ? root : extractTo;
  const ignore = ['node_modules', '.git', 'session', 'tmp', 'tmp/', 'temp', 'data', 'baileys_store.json'];
  const copied = [];
  let preservedOwner = null;
  let preservedBotOwner = null;
  try {
    const currentSettings = require('../settings');
    preservedOwner = currentSettings && currentSettings.ownerNumber ? String(currentSettings.ownerNumber) : null;
    preservedBotOwner = currentSettings && currentSettings.botOwner ? String(currentSettings.botOwner) : null;
  } catch {}
  copyRecursive(srcRoot, process.cwd(), ignore, '', copied);
  if (preservedOwner) {
    try {
      const settingsPath = path.join(process.cwd(), 'settings.js');
      if (fs.existsSync(settingsPath)) {
        let text = fs.readFileSync(settingsPath, 'utf8');
        text = text.replace(/ownerNumber:\s*'[^']*'/, `ownerNumber: '${preservedOwner}'`);
        if (preservedBotOwner) {
          text = text.replace(/botOwner:\s*'[^']*'/, `botOwner: '${preservedBotOwner}'`);
        }
        fs.writeFileSync(settingsPath, text);
      }
    } catch {}
  }
  try { fs.rmSync(extractTo, { recursive: true, force: true }); } catch {}
  try { fs.rmSync(zipPath, { force: true }); } catch {}
  return { copiedFiles: copied };
}

async function restartProcess() {
  try {
    await run('pm2 restart all');
    return;
  } catch {}
  setTimeout(() => {
    process.exit(0);
  }, 500);
}

module.exports = {
  command: 'update',
  aliases: ['upgrade', 'restart'],
  category: 'owner',
  description: 'Update bot from git or zip without stopping',
  usage: '.update [zip_url]',
  ownerOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    try {
      await sock.sendMessage(chatId, { 
        text: '🔄 Updating the bot, please wait…',
        ...channelInfo
      }, { quoted: message });
      
      let changesSummary = '';
      
      if (await hasGitRepo()) {
        const { oldRev, newRev, alreadyUpToDate, commits, files } = await updateViaGit();
        
        if (alreadyUpToDate) {
          changesSummary = `✅ Already up to date\nCurrent: ${newRev.substring(0, 7)}`;
        } else {
          changesSummary = `✅ Updated successfully!\n\n`;
          changesSummary += `📌 Old: ${oldRev.substring(0, 7)}\n`;
          changesSummary += `📌 New: ${newRev.substring(0, 7)}\n\n`;
          
          if (commits) {
            const commitLines = commits.split('\n').slice(0, 5);
            changesSummary += `📝 Recent commits:\n${commitLines.map(c => `• ${c}`).join('\n')}\n\n`;
          }
          
          if (files) {
            const fileLines = files.split('\n').slice(0, 10);
            changesSummary += `📁 Changed files:\n${fileLines.map(f => `• ${f}`).join('\n')}`;
            if (files.split('\n').length > 10) {
              changesSummary += `\n... and ${files.split('\n').length - 10} more`;
            }
          }
        }
        
        await run('npm install --no-audit --no-fund');
      } else {
        const zipOverride = args[0] || null;
        const { copiedFiles } = await updateViaZip(sock, chatId, message, zipOverride);
        
        changesSummary = `✅ Updated from ZIP!\n\n`;
        changesSummary += `📁 Files updated: ${copiedFiles.length}\n\n`;
        
        if (copiedFiles.length > 0) {
          const shown = copiedFiles.slice(0, 10);
          changesSummary += `Recent changes:\n${shown.map(f => `• ${f}`).join('\n')}`;
          if (copiedFiles.length > 10) {
            changesSummary += `\n... and ${copiedFiles.length - 10} more files`;
          }
        }
      }
      
      try {
        delete require.cache[require.resolve('../settings')];
        const newSettings = require('../settings');
        const v = newSettings.version || 'unknown';
        changesSummary += `\n\n🔖 Version: ${v}`;
      } catch {}
      
      await sock.sendMessage(chatId, { 
        text: changesSummary + '\n\n♻️ Restarting bot...',
        ...channelInfo
      }, { quoted: message });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await restartProcess();
      
    } catch (err) {
      console.error('Update failed:', err);
      await sock.sendMessage(chatId, { 
        text: `❌ Update failed:\n${String(err.message || err)}`,
        ...channelInfo
      }, { quoted: message });
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
 
