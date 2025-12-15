
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("acao")
  .setDescription("Registrar ação RP")
  .addStringOption(o => o.setName("nome").setRequired(true))
  .addStringOption(o => o.setName("horario").setRequired(true))
  .addStringOption(o => o.setName("participantes").setRequired(true))
  .addStringOption(o => o.setName("resultado").setRequired(true));

export async function execute(interaction, client){
  client.acoes.registrar({
    nome: interaction.options.getString("nome"),
    horario: interaction.options.getString("horario"),
    participantes: interaction.options.getString("participantes").split(","),
    resultado: interaction.options.getString("resultado")
  });
  await interaction.reply({ content: "🎯 Ação registrada com sucesso.", ephemeral: true });
}
