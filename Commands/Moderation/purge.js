const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const { execute } = require('../Public/ping');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a specific amout of messages from a target or channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName('amount')
        .setDescription('Amount of message to clear.')
        .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Select a target to clear their message.')
            .setRequired(false)
            ),

    async execute(interaction) {
        const {channel, options} = interaction;
        
        const amount = options.getInteger('amount');
        const target = options.getUser('target');

        const message = await channel.messages.fetch({
            limit: amount +0,
        });

        const res = new EmbedBuilder()
        .setColor(0x5fb041)

        if(target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if(msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Succesfully deleted ${message.size} messages from ${target}.`);
                interaction.reply({embeds: [res]});
                setTimeout(() => {
                    interaction.deleteReply();
                }, 3000);
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`**Deleted ${message.size} messages.**`);
                interaction.reply({embeds: [res]});
                setTimeout(() => {
                    interaction.deleteReply();
                }, 3000);
            });
        }
    }
    
}