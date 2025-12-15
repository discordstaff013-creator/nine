
import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import setupErrorHandler from "./src/handlers/errorHandler.js";
import Logger from "./src/systems/logger.js";
import { TicketEliteSystem } from "./src/systems/ticketEliteSystem.js";
import { AcoesSystem } from "./src/systems/acoesSystem.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

setupErrorHandler();

client.logger = new Logger(client);
client.tickets = new TicketEliteSystem(client);
client.acoes = new AcoesSystem(client);
client.commands = new Collection();

for (const file of fs.readdirSync("./src/commands")) {
  const command = await import(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

for (const file of fs.readdirSync("./src/events")) {
  const event = await import(`./src/events/${file}`);
  event.once
    ? client.once(event.name, (...args) => event.execute(...args, client))
    : client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(process.env.TOKEN);
