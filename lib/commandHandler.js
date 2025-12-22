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
 


const fs = require('fs');
const path = require('path');

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.categories = new Map();
  }
  
  loadCommands() {
    const pluginsPath = path.join(__dirname, '../plugins');
    const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      try {
        const filePath = path.join(pluginsPath, file);
        delete require.cache[require.resolve(filePath)];
        const plugin = require(filePath);
        
        if (plugin.command) {
          this.registerCommand(plugin);
        }
      } catch (error) {
        console.error(`Error loading ${file}:`, error.message);
      }
    }
  }
  registerCommand(plugin) {
    const { command, aliases = [], category = 'misc', handler } = plugin;
    this.commands.set(command.toLowerCase(), {
      command,
      handler,
      category,
      aliases,
      ...plugin
    });
    for (const alias of aliases) {
      this.aliases.set(alias.toLowerCase(), command.toLowerCase());
    }
    if (!this.categories.has(category)) {
      this.categories.set(category, []);
    }
    this.categories.get(category).push(command);
  }
  reloadCommands() {
    this.commands.clear();
    this.aliases.clear();
    this.categories.clear();
    this.loadCommands();
  }
  getCommand(text, prefixes) {
    const usedPrefix = prefixes.find(p => text.startsWith(p));
    if (!usedPrefix) return null;
    const fullCommand = text.slice(usedPrefix.length).split(' ')[0].toLowerCase();
    
    if (this.commands.has(fullCommand)) {
      return this.commands.get(fullCommand);
    }
    if (this.aliases.has(fullCommand)) {
      const mainCommand = this.aliases.get(fullCommand);
      return this.commands.get(mainCommand);
    }

    return null;
  }
  getCommandsByCategory(category) {
    return this.categories.get(category) || [];
  }
}

module.exports = new CommandHandler();


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
 