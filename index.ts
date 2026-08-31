import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { DISCORD_TOKEN } from './config.ts';
import { commands } from './commands/index.ts';
import type { Command } from './command.ts';
import { handleInteraction } from './router/router.ts';
import { buttons } from "./handlers/index.ts";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection<string, Command>();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

for (const command of commands) {
    client.commands.set(command.data.name, command);
}

for (const button of buttons){
    client.buttons.set(button.customId, button);
}
console.log("Loaded buttons:", [...client.buttons.keys()]);
client.once(Events.ClientReady, (ready) => {
    console.log(`logged in as ${ready.user.tag}, serving ${client.commands.size} command(s)`);
    client.commands.forEach(cmd => console.log(cmd.data.name));
});

client.on(Events.InteractionCreate, (interaction) => {
    handleInteraction(interaction, client);
});

await client.login(DISCORD_TOKEN);
