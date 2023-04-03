const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Select the user you want to mute.')
            .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('time')
            .setDescription('How long should the mute last?')
            .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason of the mute?')
            .setRequired(false)
            ),

        async execute(interaction) {
            const {guild, options} = interaction;

            let user = options.getUser('user')
            let member = guild.members.cache.get(user.id)
            let time = options.getString('time')
            let convertedTime = ms(time);
            let reason = options.getString('reason') || '*No reason given*';

            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Something went wrong. Please try again later.`)
                .setTimestamp()

            const successEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`**${user} was muted in ${time}** | ${reason}.`)
                .setTimestamp()

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true })

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
                return interaction.reply({ embeds: [errEmbed], ephemeral: true })

            if (!convertedTime)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true })

            try {
                await member.timeout(convertedTime, reason);

                interaction.reply({ embeds: [successEmbed] })
            } catch (err) {
                console.log(err);
            }
        }
}