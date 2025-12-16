import { EmbedBuilder } from "discord.js";

export class ActionSystem {
  constructor() {
    this.actions = new Map(); // messageId -> dados da ação
  }

  criar({ nome, horario, limite }) {
    const embed = new EmbedBuilder()
      .setTitle("🎯 AÇÃO RP")
      .setColor("#5865F2")
      .addFields(
        { name: "Ação", value: nome, inline: true },
        { name: "Horário", value: horario, inline: true },
        { name: "Vagas", value: `0 / ${limite}` },
        { name: "Escalação", value: "—" }
      )
      .setTimestamp();

    return embed;
  }

  registrar(messageId, dados) {
    this.actions.set(messageId, {
      nome: dados.nome,
      horario: dados.horario,
      limite: dados.limite,
      participantes: []
    });
  }

  async entrar(interaction) {
    const data = this.actions.get(interaction.message.id);
    if (!data) {
      return interaction.reply({
        content: "❌ Essa ação não existe mais.",
        ephemeral: true
      });
    }

    if (data.participantes.includes(interaction.user.id)) {
      return interaction.reply({
        content: "⚠️ Você já está na escalação.",
        ephemeral: true
      });
    }

    if (data.participantes.length >= data.limite) {
      return interaction.reply({
        content: "❌ A ação já está cheia.",
        ephemeral: true
      });
    }

    data.participantes.push(interaction.user.id);

    const lista =
      data.participantes.length > 0
        ? data.participantes.map((id, i) => `${i + 1}. <@${id}>`).join("\n")
        : "—";

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .spliceFields(2, 2,
        { name: "Vagas", value: `${data.participantes.length} / ${data.limite}` },
        { name: "Escalação", value: lista }
      );

    await interaction.message.edit({ embeds: [embed] });

    return interaction.reply({
      content: "✅ Você entrou na ação.",
      ephemeral: true
    });
  }
}
