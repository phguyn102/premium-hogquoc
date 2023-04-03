const {Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { openticket, guildAvatar } = require("../../config.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ticket")
      .setDescription("Create a ticket message")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
    async execute(interaction) {
      const { guild } = interaction;
  
      const embed = new EmbedBuilder()
        .setAuthor({name: `${interaction.guild.name}`, iconURL: guildAvatar})
        .setTitle("<a:moon:1092134338537214152> **Welcome To 𝐇𝐎𝐆𝐖𝐀𝐑𝐓𝐒 | ☠ Ticket** <a:moon:1092134338537214152>")
        .setDescription(`<a:hw_card:953851855623036968> Nếu có nhu cầu book: nhấn nút **BOOKING** sẽ gặp <@&936608835890716683> hỗ trợ tư vấn book 1 chiếc phù thủy tuyệt vời để tâm sự nè.
        \n 
<a:hw_card:953851855623036968> 𝐇𝐨𝐠𝐰𝐚𝐫𝐭𝐬 | ☠ luôn chào đón thêm thành viên vào gia đình chúng mình, nhất nút **APPLY** để đăng ký làm <@&982108166265401418> nha.
        \n
<a:hw_card:953851855623036968> Nếu có thắc mắc hay góp ý về dịch vụ của 𝐇𝐨𝐠𝐰𝐚𝐫𝐭𝐬 | ☠, nhấn nút **SUPPORT**.`)
        .setThumbnail(guildAvatar)
  
      const button =  new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setCustomId("Booking")
          .setLabel("BOOKING")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🥑"),
        new ButtonBuilder()
          .setCustomId("Apply")
          .setLabel("APPLY")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🍒"),
        new ButtonBuilder()
          .setCustomId("Support")
          .setLabel("SUPPORT")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🍉")
      );
  
      await guild.channels.cache.get(openticket).send({ embeds: ([embed]), components: [button]});
  
      interaction.reply({ content: "Ticket message has been sent", ephemeral: true,});
    },
  };