import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder,ButtonBuilder, ButtonStyle } from "discord.js";
import type { Command } from "../command.ts";

export const vote: Command = {
    data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Create a 👍👎 vote")
    .addStringOption(opt =>
        opt.setName("question")
            .setDescription("The question to vote on.")
            .setRequired(true)
    ),
    async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const question = interaction.options.getString("question", true);

    await interaction.editReply({
        content: `🗳️ **${question}**`,
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("vote_yes")
                    .setLabel("Yes")
                    .setEmoji("👍")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("vote_no")
                    .setLabel("No")
                    .setEmoji("👎")
                    .setStyle(ButtonStyle.Danger)
            )
        ]
    });
    }
}
