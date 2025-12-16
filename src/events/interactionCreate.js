import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from "discord.js";

export const name = "interactionCreate";

export async function execute(interaction, client) {

  /* =========================
     SLASH COMMANDS
  ==========================*/
  if (interaction.isChatInputCommand()) {

    /* /elite → abre formulário */
    if (interaction.commandName === "elite") {
      const modal = new ModalBuilder()
        .setCustomId("modal_elite")
        .setTitle("⭐ Formulário Elite");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("nome")
            .setLabel("Nome RP")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("id")
            .setLabel("ID")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("motivo")
            .setLabel("Motivo")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("clip")
            .setLabel("Clip / Prova (link)")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        )
      );

      return interaction.showModal(modal);
    }

    /* /acao → abre formulário */
    if (interaction.commandName === "acao") {
      const modal = new ModalBuilder()
        .setCustomId("modal_acao")
        .setTitle("🎯 Criar Ação RP");

      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("acao")
            .setLabel("Nome da Ação")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("horario")
            .setLabel("Horário")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("limite")
            .setLabel("Quantidade de Pessoas")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

      return interaction.showModal(modal);
    }
  }

  /* =========================
     MODAIS
  ==========================*/
  if (interaction.isModalSubmit()) {

    /* FORMULÁRIO ELITE */
    if (interaction.customId === "modal_elite") {
      const nome = interaction.fields.getTextInputValue("nome");
      const id = interaction.fields.getTextInputValue("id");
      const motivo = interaction.fields.getTextInputValue("motivo");
      const clip = interaction.fields.getTextInputValue("clip") || "Não enviado";

      const embed = new EmbedBuilder()
        .setTitle("⭐ NOVO PEDIDO DE ELITE")
        .setColor("Gold")
        .addFields(
          { name: "Nome", value: nome },
          { name: "ID", value: id },
          { name: "Motivo", value: motivo },
          { name: "Clip", value: clip }
        )
        .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("elite_aprovar")
          .setLabel("Aprovar")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("elite_reprovar")
          .setLabel("Reprovar")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.channel.send({
        embeds: [embed],
        components: [row]
      });

      return interaction.reply({
        content: "✅ Pedido enviado para análise.",
        ephemeral: true
      });
    }

    /* FORMULÁRIO AÇÃO */
    if (interaction.customId === "modal_acao") {
      const nome = interaction.fields.getTextInputValue("acao");
      const horario = interaction.fields.getTextInputValue("horario");
      const limite = interaction.fields.getTextInputValue("limite");

      const embed = client.acoes.criar({
        nome,
        horario,
        limite
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("acao_entrar")
          .setLabel("Entrar na Escalação")
          .setStyle(ButtonStyle.Primary)
      );

      const msg = await interaction.channel.send({
        content: "@everyone",
        embeds: [embed],
        components: [row]
      });

      client.acoes.registrar(msg.id, {
        nome,
        horario,
        limite
      });

      return interaction.reply({
        content: "🎯 Ação criada com sucesso.",
        ephemeral: true
      });
    }
  }

  /* =========================
     BOTÕES
  ==========================*/
  if (interaction.isButton()) {

    /* ENTRAR NA AÇÃO */
    if (interaction.customId === "acao_entrar") {
      return client.acoes.entrar(interaction);
    }

    /* ELITE APROVAR */
    if (interaction.customId === "elite_aprovar") {
      client.logger.eliteAprovado(
        interaction.message.embeds[0].fields[0].value,
        interaction.user
      );
      return interaction.reply({ content: "⭐ Elite aprovado.", ephemeral: true });
    }

    /* ELITE REPROVAR */
    if (interaction.customId === "elite_reprovar") {
      client.logger.eliteReprovado(
        interaction.message.embeds[0].fields[0].value,
        interaction.user
      );
      return interaction.reply({ content: "❌ Elite reprovado.", ephemeral: true });
    }
  }
}
