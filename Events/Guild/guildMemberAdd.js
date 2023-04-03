const {EmbedBuilder} = require('@discordjs/builders');
const {GuildMember, Embed} = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get('1087340040155304016');
        const welcomeMessage = `Welcome <@${member.id}> to the guild!`;

        const welcomeEmbed = new EmbedBuilder()
        .setTitle('New member!')
        .setDescription(`Welcome to abcxyz`)
        .setColor(0xFFE8A9)
        .setAuthor({iconURL: member.user.displayAvatarURL(),
            name: member.user.tag
        })
        .setFooter({text: `${guild.memberCount} members`})
        .setTimestamp();

        welcomeChannel.send({embeds: [welcomeEmbed], content: welcomeMessage});
    }
}