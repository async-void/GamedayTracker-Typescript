import { REST, Routes } from 'discord.js';
import { commands } from './commands/index.ts';
import { DISCORD_TOKEN, CLIENT_ID } from './config.ts';

const body = commands.map((command) => command.data.toJSON());
const rest = new REST().setToken(DISCORD_TOKEN);

const data = await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body },
) as unknown[];

console.log(`registered ${data.length} command(s) Globally!}`);