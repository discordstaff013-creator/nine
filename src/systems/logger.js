
import { EmbedBuilder, Colors } from "discord.js";
import fs from "fs";

// Ler config.json de forma compatível com Render
const config = JSON.parse(
  fs.readFileSync(new URL("../../config.json", import.meta.url))
);

export default class Logger {
  constructor(client){
    this.client = client;
  }

  eliteAprovado(user, staff){
    const ch = this.client.channels.cache.get(config.elite.logElite);
    if(!ch) return;

    ch.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("⭐ ELITE APROVADO")
          .setColor(Colors.Green)
          .addFields(
            { name: "Usuário", value: `${user}` },
            { name: "Responsável", value: `${staff}` }
          )
          .setTimestamp()
      ]
    });
  }

  eliteReprovado(user, staff){
    const ch = this.client.channels.cache.get(config.elite.logElite);
    if(!ch) return;

    ch.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("❌ ELITE REPROVADO")
          .setColor(Colors.Red)
          .addFields(
            { name: "Usuário", value: `${user}` },
            { name: "Responsável", value: `${staff}` }
          )
          .setTimestamp()
      ]
    });
  }

  logAcao(data){
    const ch = this.client.channels.cache.get(config.logs.acoes);
    if(!ch) return;

    ch.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("🎯 AÇÃO RP")
          .setColor(Colors.Blurple)
          .addFields(
            { name: "Ação", value: data.nome },
            { name: "Horário", value: data.horario },
            { name: "Participantes", value: data.participantes.join(", ") },
            { name: "Resultado", value: data.resultado }
          )
          .setTimestamp()
      ]
    });
  }
}

