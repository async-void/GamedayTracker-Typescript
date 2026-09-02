import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../command.ts";

export const tag: Command = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Create a tag, or take one away.')
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Create a tag.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the tag.')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove a tag.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the tag to remove.')
                        .setRequired(true)
                )
        ) as SlashCommandBuilder,

     async execute(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'create') {
            const name = interaction.options.getString('name');
            // handle creation
            await interaction.reply(`Created tag: ${name}`);
        }

        if (sub === 'remove') {
            const name = interaction.options.getString('name');
            // handle removal
            await interaction.reply(`Removed tag: ${name}`);
        }
    },
};