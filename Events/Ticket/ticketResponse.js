const { ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const ticketSchema = require('../../Models/Ticket');
const { ticketParent, everyone, supporter, guildAvatar } = require('../../config.json');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 900) + 10000;

        if (!interaction.isButton()) return;

        if (!["Booking", "Apply", "Support"].includes(customId)) return;
        
        if (!guild.members.me.permissions.has(ManageChannels))
            interaction.reply({content: "I don't have permissions for this.", ephemeral: true});

        try {
            await guild.channels.create({
                name: `ticket-${member.user.username}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [
                    {
                        id: everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id, 
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: supporter,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    }
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${guild.name}`, iconURL: guildAvatar })
                    .setTitle(`${interaction.user.tag} - Ticket ${customId}`)
                    .setDescription(`\n♡ Chúng tớ sẽ phản hồi quý khách sớm nhất có thể. 
                    \n ♡ Quý khách có thể đưa ra yêu cầu trước để việc hỗ trợ nhanh hơn nha.`)
                    .setFooter({ text: `${guild.name}`})
                    .setTimestamp();

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Close').setStyle(ButtonStyle.Primary).setEmoji('🔒'),
                    new ButtonBuilder().setCustomId('re-open').setLabel('Re - Open').setStyle(ButtonStyle.Secondary).setEmoji('🔓'),
                    new ButtonBuilder().setCustomId('delete').setLabel('Delete').setStyle(ButtonStyle.Danger).setEmoji('⛔'),
                    new ButtonBuilder().setCustomId('transcript').setLabel('Transcript').setStyle(ButtonStyle.Success).setEmoji('📑')
                    
                );


                channel.send({
                    embeds: ([embed]),
                    components: [
                        button
                    ], content: `${interaction.user}, <@&936608835890716683>`

                });
                
                interaction.reply({ content: `Your ticket is now open in <#${channel.id}>`, ephemeral: true });
            });
        } catch (err) {
            return console.log(err);
        }
    }
}