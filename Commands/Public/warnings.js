const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const warningSchema = require("../../Models/Warn");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription(
            "This gets a users warnings.")
        .addUserOption(option => option.setName('user').setDescription("The user you want to see their warnings on.").setRequired(true)),

    async execute(interaction, client) {

        const { options, guildId, user } = interaction;

        const target = options.getUser('user');

        const warns = new EmbedBuilder()
        const noWarns = new EmbedBuilder()

        warningSchema.findOne({ GuildId: guildId, UserId: target.id, UserTag: target.tag }, async  (err, data) => {

            if (err) throw err;

            if (data) {
                embed.setColor("Blue")
                .setDescription(`:white_check_mark: ${target.user}'s warnings: \n${data.Content.map(
                    (w, i) => 
                        `
                            **Warning**: ${i + 1}
                            **Warning Moderator**: ${w.ExecutorTag}
                            **Warn Reason**: ${w.Reason}
                        `
                ).join(`-`)}`)

                interaction.reply({ embeds: [embed] })
            } else{
                noWarns.setColor("Blue")
                .setDescription(`:white_check_mark: ${target.user}'s has no warnings!`)

                interaction.reply({ embeds: [noWarns]})
            }
            
        });
    }
}