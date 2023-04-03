const {CommandInteraction} = require('discord.js');

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        if(interaction.isChatInputCommand()) {

        const command = client.commands.get(interaction.commandName);

        if(!command) {
            interaction.reply({ content: "outdated command"});
        }
        command.execute(interaction, client);
        } else if (interaction.isButton()) {
          const  { customId } = interaction;

          if (customId == "verify") {
            const role = interaction.member.roles.add(role). then((memeber) =>
            interaction.reply({
                content: `${role} has been assigned to you.`,
                ephemeral: true,
            })
            );
          }
        } else {
            return;
        }
    },
};