const { Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const accountSchema = require("../../Models/Account");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("economy")
    .setDescription(`Check your economy balance.`)
    .addStringOption(option =>
    option.setName("options")
    .setDescription(`Choose an option`)
    .setRequired(true)
    .addChoices(
        { name: "Create", value: "create" },
        { name: "Balance", value: "balance"},
        { name: "Delete", value: "delete" }
    )
    ),

    async execute(interaction) {
        const {options, user, guild } = interaction;

        let Data = await accountSchema.findOne({ Guild: interaction.guild.id, User: user.id }).catch(err => { })

        switch(options.getString("options")) {
            case "create": {
                if (Data) return interaction.reply({content: "You already have an economy account."})

                Data = new accountSchema({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Bank: 0,
                    Wallet: 0
                })

                await Data.save()

                interaction.reply({ content: "Your account has been created successfully"})
            }
            break;

            case "balance": {
                if (!Data) return interaction.reply({content: "Please create an economy account first."})
                const embed = new EmbedBuilder()
                .setTitle("Economy Account Balance")
                .setColor("Yellow")
                .setDescription(`**Bank:** ${Data.Bank}$\n **Wallet:** ${Data.Wallet}$\n**Total:** ${Data.Bank + Data.Wallet}$`)

                await interaction.reply({embeds: [embed] })
            }
            break;

            case "delete": {
                if(!Data) return interaction.reply({content: "Please create an economy account first."})

                await Data.delete()

                interaction.reply({content: "Your economy account for this server has been deleted."})
            }
            break;
        }
    }
}