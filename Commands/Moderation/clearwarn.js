const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const warningSchema = require("../../Models/Warn");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('clearwarn')
  .setDescription('Clears a members warnings')
  .addUserOption(option => option.setName('user').setDescription('The user you wanna clear the warnings.').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "You don't have Perms to do this."});
    
    const [ options, guildId, user ] = interaction;

    const target = options.getUser('user');

    const embed = new EmbedBuilder()

    warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
      if (err) throw err;

      if (data) {
        await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, UserTag: target.tag})

        embed.setColor("blue")
        .setDescription(`${target.user}'s warnings have been cleared`)

        interaction.reply({ embeds: [embed] });
  } else {
    interaction.reply({ content: `${target.user} has no warnings to be cleared` })
  }
});
}
}