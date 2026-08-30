import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { DISCORD_TOKEN } from './config.ts';
import { commands } from './commands/index.ts';
import type { Command } from './command.ts';

const registry = new Collection<string, Command>();
for (const command of commands) {
    registry.set(command.data.name, command);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (ready) => {
    console.log(`logged in as ${ready.user.tag}, serving ${registry.size} command(s)`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = registry.get(interaction.commandName);
    if (!command) {
        console.error(`no command named ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(`${interaction.commandName} failed`, error);
        const body = { content: 'That command failed.', flags: MessageFlags.Ephemeral } as const;
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(body);
        }
        else {
            await interaction.reply(body);
        }
    }
});

await client.login(DISCORD_TOKEN);