const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
        option.setName('user')
        .setDescription('Select the user you want to unmute.')
        .setRequired(true)
        ),
    async execute(interaction) {
        const {guild, options} = interaction;

        const user = options.getUser('user');
        const member = guild.members.cache.get(user.id);
       
        const errEmbed = new EmbedBuilder()
            .setDescription('Something went wrong. Please try again later.')
            .setColor(0xc72c3b)

            const successEmbed = new EmbedBuilder()
            .setDescription(`**${user} was unmuted.** `)
            .setColor(0x5fb041)
            .setTimestamp();

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true}); //can't use this command on someone with equal or higher perms
    
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: true});

             
            try {
                await member.timeout(null);
    
                interaction.reply({ embeds: [successEmbed], ephemeral: false});
            } catch (err) {
                console.log(err);
            }
           
        }
    
}