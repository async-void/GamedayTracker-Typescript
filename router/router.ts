import { Client, MessageFlags } from "discord.js";
import type { Interaction } from "discord.js";

export async function handleInteraction(interaction: Interaction, client: Client) {
    try {
        // ---------------------------
        // Slash Commands
        // ---------------------------
        if (interaction.isChatInputCommand()) {
            
            const command = client.commands.get(interaction.commandName);
          
            if (!command) {
                console.info(`Missing command: ${interaction.commandName}`)
                return;
            }
            return command.execute(interaction, client);
        }

        // ---------------------------
        // Buttons (Component V2)
        // ---------------------------
        if (interaction.isButton()) {
            console.log("Button clicked:", interaction.customId);
            const handler = client.buttons.get(interaction.customId);
            if (!handler) {
                console.info(`Missing command: ${handler}`)
                return;
            }

            return handler.execute(interaction, client);
        }

        // ---------------------------
        // Select Menus
        // ---------------------------
        if (interaction.isAnySelectMenu()) {
            const handler = client.selectMenus.get(interaction.customId);
            if (!handler) {
                return interaction.followUp({
                    content: "This menu is no longer active.",
                    flags: MessageFlags.Ephemeral
                });
            }

            return handler.execute(interaction, client);
        }

        // ---------------------------
        // Modals
        // ---------------------------
        if (interaction.isModalSubmit()) {
            const handler = client.modals.get(interaction.customId);
            if (!handler) {
                return interaction.followUp({
                    content: "This modal is no longer active.",
                    flags: MessageFlags.Ephemeral
                });
            }

            return handler.execute(interaction, client);
        }

        // ---------------------------
        // Autocomplete
        // ---------------------------
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command || !command.autocomplete) return;

            return command.autocomplete(interaction, client);
        }

    } catch (err) {
        console.error("Interaction error:", err);

        if (interaction.isRepliable()) {
            return interaction.reply({
                content: "An error occurred while processing this interaction.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
