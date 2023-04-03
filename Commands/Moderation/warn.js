const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const warningSchema = require("../../Models/Warn");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warns a user')
  .addUserOption(option => option.setName('user').setDescription('The user you wanna warn.').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason you wanna warn this user.').setRequired(false)),
 
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "You don't have Perms to do this."});
    
    const { options, guildId, user } = interaction;

    const target = options.getUser('user');
    const reason = options.getString(`reason`) || "No reason given"

    const userTag = `${target.username}#${target.discriminator}`

    warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
      if (err) throw err;

      if (!data) {
        data = new warningSchema({
          GuildID: guildId,
          UserID: target.id,
          UserTag: userTag,
          Content: [
            {
              ExecuterId: user.id,
              ExecuterTag: user.tag,
              Reason: reason
            }
          ],
        });
      } else {
        const warnContent = {
        ExecuterId: user.id,
        ExecuterTag: user.tag,
        Reason: reason
         }
         data.Content.push(warnContent);

      }
      data.save()
    });
    const embed = new EmbedBuilder()
    .setColor('Purple')
    .setDescription(`You have been **WARNED** in ${interaction.guild.name} | ${reason}`)
    
    const embed2 = new EmbedBuilder()
        .setColor('Purple')
        .setDescription(`${target.user} has been **WARNED** | ${reason}`)

   target.send({ embeds: [embed] }).catch(err => {
    return;
   })
   interaction.reply({ embeds: [embed2] })
  }
}