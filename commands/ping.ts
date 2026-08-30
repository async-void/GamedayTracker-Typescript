import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../command.ts';

export const ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the bot is alive and reports its latency.'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: `pong — ${Math.round(interaction.client.ws.ping)} ms to the gateway`,
            flags: MessageFlags.Ephemeral,
        });
    },
};