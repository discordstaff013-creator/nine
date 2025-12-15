import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("acao")
  .setDescription("Registrar uma ação RP")
  .addStringOption(o =>
    o.setName("nome")
     .setDescription("Nome da ação")
     .setRequired(true)
  )
  .addStringOption(o =>
    o.setName("horario")
     .setDescription("Horário da ação")
     .setRequired(true)
  )
  .addStringOption(o =>
    o.setName("participantes")
     .setDescription("Lista de participantes (separados por vírgula)")
     .setRequired(true)
  )
  .addStringOption(o =>
    o.setName("resultado")
     .setDescription("Resultado da ação (ganhou/perdeu)")
     .setRequired(true)
  );

export async function execute(interaction, client){
  client.acoes.registrar({
    nome: interaction.options.getString("nome"),
    horario: interaction.options.getString("horario"),
    participantes: interaction.options.getString("participantes").split(","),
    resultado: interaction.options.getString("resultado")
  });

  await interaction.reply({
    content: "🎯 Ação registrada com sucesso.",
    ephemeral: true
  });
}
