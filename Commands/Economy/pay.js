const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionCollector } = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("economy-pay")
    .setDescription(`Pay someone money in the economy system.`)
    .addUserOption(option =>
        option.setName("user")
        .setDescription(`The user whom u want to pay money`)
        .setRequired(true)
        )
    .addNumberOption(option =>
        option.setName("amount")
        .setDescription(`The amount which the user should receive.`)
        .setRequired(true)
        ),

    async execute(interaction, client) {
        const { user, options, guild } = interaction;

        const Member = options.getUser("user")
        let amount = options.getNumber("amount")
        const sender = user;

        let Data = await accountSchema.findOne({ Guild: interaction.guild.id, User: Member.id }).catch(err => { })
        if (!Data) return interaction.reply({ content: "the user has no economy account."})

        const Sender = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id
        })

        const MoneyReceiver = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })

        if (Sender.Wallet < amount) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have enough money. \n You have ${Sender.Wallet} \nAmount: ${amount}`)
                ],
            })
        }

        if (sender === Member) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You can't send money to yourself.`)
                ],
            })
        }

        const dataSend = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: sender.id
        })
        dataSend.Wallet -= amount
        dataSend.save()

        const dataReceived = await accountSchema.findOne({
            Guild: interaction.guild.id,
            User: Member.id
        })
        dataReceived.Wallet += amount
        dataReceived.save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Green")
                .setDescription(`You've sent ${amount} to ${Member}.`)
            ],
        })
    }
}