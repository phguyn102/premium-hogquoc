const {ButtonInteraction, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const {createTranscript} = require('discord-html-transcripts');
const {transcripts} = require('../../config.json');
const ticketSchema = require('../../Models/Ticket');

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ManageChannels, SendMessages, ManageMessages } = PermissionFlagsBits;

        if (!interaction.isButton()) return;

        if (!["close","re-open","delete", "transcript"].includes(customId)) return;

        if (!guild.members.me.permissions.has(ManageChannels))
        return interaction.reply({content: "I don't have permissions for this.", ephemeral: true});

        const embed = new EmbedBuilder().setColor("Aqua");

        ticketSchema.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MemberID);

            switch (customId) {
                case "close":
                    if (data.Locked == true)
                    return interaction.reply({ content: "Ticket đã được đóng."});

                    await ticketSchema.updateOne({ ChannelID: channel.id}, {Locked: true});
                    embed.setDescription(`Ticket được đóng bởi ${interaction.user}`);

                    channel.permissionOverwrites.edit(fetchedMember, { SendMessages: false, ViewChannel: false });
                    channel.setName(`Closed-${member.user.username}`)

                    return interaction.reply({ embeds: [embed] });


            case "re-open":
                    if (!member.permissions.has(ManageMessages))
                       return interaction.reply({ content: "Bạn không có quyền để Re-Open Ticket"});

                    if (data.Locked == false)
                       return interaction.reply({ content: "Ticket đã được mở lại."});

                    await ticketSchema.updateOne({ ChannelID: channel.id}, {Locked: false});
                    embed.setDescription(`Ticket mở bởi ${interaction.user}`);

                    channel.permissionOverwrites.edit(fetchedMember, { SendMessages: true, ViewChannel: true });
                    channel.setName(`ticket-re-opened-by-${member.user.username}`);

                    return interaction.reply({ embeds: [embed] });


            case "delete":
                    if (!member.permissions.has(ManageMessages))
                        return interaction.reply({ content: `${interaction.user}, bạn không có quyền để Xóa Ticket`});

                    if(data.Locked == false)
                        return interaction.reply({content: `Đóng ticket trước khi xóa.`});

                    if(data.closed == true)
                        return 
                    
                    embed.setDescription(`Ticket sẽ được xóa sau vài giây`);

                    setTimeout(() => {channel.delete();}, 6000);

                    return interaction.reply({ embeds: [embed] });
                    

                case "transcript":
                    if (!member.permissions.has(ManageMessages))
                       return interaction.reply({ content: "Bạn không có quyền để Transcript"});

                    if(data.closed == true)
                        return interaction.reply({context: "Transcript saved", ephemeral: true});

                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        filename: `${member.user.username}-ticket${data.type}-${data.TicketID}.html`
                        });

                    await ticketSchema.updateOne({channelID: channel.id}, {Closed: true});

                    const transcriptEmbed = new EmbedBuilder()
                        .setTitle(`Transcript Type: ${data.customId}\n ID: ${data.TicketID}`)
                        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true}) })
                        .setTimestamp();

                    const transcriptProcess = new EmbedBuilder()
                        .setDescription(`Transcript saved to <#${transcripts}>`)
                        .setColor("Red")
                        .setTimestamp();

                        const res = await guild.channels.cache.get(transcripts).send({
                            embeds: [transcriptEmbed],
                            files: [transcript],
                        });

                        channel.send({ embeds: [transcriptProcess, res]});

                    
                    
                
                    
                    break;
                    
                
            }
        });
    }
}