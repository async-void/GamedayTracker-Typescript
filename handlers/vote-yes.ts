import { ButtonInteraction, Client, MessageFlags } from "discord.js";
import type { Button } from "../types/button.ts";

export default {
    customId: "vote_yes",
    async execute(interaction: ButtonInteraction, client: Client) {
        await interaction.reply({
            content: "👍 yes vote counted!",
            flags: MessageFlags.Ephemeral
        });
    }
} satisfies Button;