
import { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config.json" assert { type: "json" };

export class TicketEliteSystem {
  constructor(client){
    this.client = client;
    this.open = new Set();
  }

  async criar(interaction){
    if(this.open.has(interaction.user.id)){
      return interaction.reply({ content: "❌ Você já possui um ticket aberto.", ephemeral: true });
    }

    this.open.add(interaction.user.id);

    const channel = await interaction.guild.channels.create({
      name: `elite-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: config.elite.categoria,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: config.elite.cargoRespElite, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ]
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("elite_aprovar").setLabel("Aprovar").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("elite_reprovar").setLabel("Reprovar").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("elite_fechar").setLabel("Fechar").setStyle(ButtonStyle.Secondary)
    );

    await channel.send({
      content: `${interaction.user}`,
      embeds: [new EmbedBuilder().setTitle("⭐ Ticket Elite").setColor("Gold")],
      components: [row]
    });

    await interaction.reply({ content: "⭐ Ticket Elite criado com sucesso.", ephemeral: true });
  }

  fechar(interaction){
    this.open.delete(interaction.user.id);
    interaction.channel.delete().catch(()=>{});
  }
}
