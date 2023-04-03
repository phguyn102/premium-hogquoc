const { Client, GatewayIntentBits, EmbedBuilder, Partials, Collection, PermissionsBitField, Permissions, MessageManager, Embed, Events, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ModalBuilder, ButtonStyle, ChannelType, getTextInputValue, MessageContent } = require(`discord.js`);
const fs = require('fs');


const {Guilds, GuildMembers, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel} = Partials;

const {loadEvents} = require(`./Handlers/eventHandler`);
const {loadCommands} = require('./Handlers/commandHandler');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] }); 

client.commands = new Collection();
client.config = require('./config.json');
client.giveawayConfig = require("./config.js");

['giveawaysEventsHandler','giveawaysManager'].forEach((x) => {
    require(`./Utils/${x}`)(client);
})

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);

});

client.on('ready', () =>{
    console.log(`${client.user.username} is now online.`);
});