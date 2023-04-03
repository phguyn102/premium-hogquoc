const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const { execute } = require('../Public/ping');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of all the commands from the discord bot.'),
    async execute(interaction) {
        
        const embed = new EmbedBuilder()
        .setTitle('BOT COMMANDS')
        .setDescription(`List of commands:`)
        .addFields("INFO, `help` ")
        .addFields("MODERATION, `ban` `unban` `kick` `purge` `mute` `unmute` ")

        interaction.reply({ embeds: [embed] });

        
    
},
}; 