import fs from "fs";

const config = JSON.parse(
  fs.readFileSync(new URL("../../config.json", import.meta.url))
);

export const name = "interactionCreate";

export async function execute(interaction, client){

  // Slash commands
  if(interaction.isChatInputCommand()){
    const command = client.commands.get(interaction.commandName);
    if(command){
      await command.execute(interaction, client);
    }
  }

  // Botões
  if(interaction.isButton() && interaction.channel){

    if(!interaction.member.roles.cache.has(config.elite.cargoRespElite)){
      return interaction.reply({
        content: "⛔ Apenas Resp.Elite.",
        ephemeral: true
      });
    }

    if(interaction.customId === "elite_aprovar"){
      await interaction.reply({
        content: "✅ Elite aprovado.",
        ephemeral: true
      });
      client.logger.eliteAprovado(interaction.channel.name, interaction.user);
    }

    if(interaction.customId === "elite_reprovar"){
      await interaction.reply({
        content: "❌ Elite reprovado.",
        ephemeral: true
      });
      client.logger.eliteReprovado(interaction.channel.name, interaction.user);
    }

    if(interaction.customId === "elite_fechar"){
      client.tickets.fechar(interaction);
    }
  }
}
