import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../command.ts";

export const scoreboard: Command = {
    data: new SlashCommandBuilder()
        .setName("scoreboard")
        .setDescription("Get the current NFL scoreboard."

    ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
    } 
}