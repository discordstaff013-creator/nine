
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("elite")
  .setDescription("Abrir ticket Elite");

export async function execute(interaction, client){
  await client.tickets.criar(interaction);
}
