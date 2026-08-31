import type { ButtonInteraction, Client } from "discord.js";

export interface Button {
    customId: string;
    execute: (interaction: ButtonInteraction, client: Client) => Promise<unknown>;
}