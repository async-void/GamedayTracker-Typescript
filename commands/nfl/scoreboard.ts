import { ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";

import type { Command } from "../../command.ts";
import type { NflScoreboard } from "../../models/nfl/NflScoreboard.ts";

import { getScoreboard } from "../../espn/espnClient.ts";
import { NflEmojiMapper } from "../../mappers/nflEmojiMapper.ts";

export const scoreboard: Command = {
    data: new SlashCommandBuilder()
        .setName("scoreboard")
        .setDescription("Get the current NFL scoreboard.") as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const json = (await getScoreboard(0,0,0)) as NflScoreboard;

        const finals: string[] = [];
        const inProgress: string[] = [];
        const scheduled: string[] = [];

        for (const event of json.events) {
            const comp = event.competitions[0];
            if (!comp) continue;

            const home = comp.competitors.find(c => c.homeAway === "home");
            const away = comp.competitors.find(c => c.homeAway === "away");
            if (!home || !away) continue;

            const homeEmoji = NflEmojiMapper.get(home.team.abbreviation);
            const awayEmoji = NflEmojiMapper.get(away.team.abbreviation);

            const state = event.status?.type?.state;

            let line: string;

            if (state === "post") {
                // FINAL
                line = `${awayEmoji}(${away.score}) 🆚 ${homeEmoji}(${home.score}) \\|\\| Final`;
                finals.push(line);

            } else if (state === "in") {
                // IN PROGRESS → show score
                line = `${awayEmoji}(${away.score}) 🆚 ${homeEmoji}(${home.score}) \\|\\| ${away.score}–${home.score}`;
                inProgress.push(line);

            } else {
                // SCHEDULED → show date + time
                const date = new Date(event.date);

                const time = date.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone: "America/New_York"
                });

                const day = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                });

                line = `${awayEmoji} 🆚 ${homeEmoji} \\|\\| ${day} ${time} ET`;
                scheduled.push(line);
            }
        }

        const scoresMsg = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(
                    `**NFL Scoreboard**\n\n` +
                    `**Scheduled Games**\n${scheduled.length > 0 ? scheduled.join("\n") : "None"}\n\n` +
                    `**In Progress**\n${inProgress.length > 0 ? inProgress.join("\n") : "None"}\n\n` +
                    `**Finals**\n${finals.length > 0 ? finals.join("\n") : "None"}`
                )
        );

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [scoresMsg]
        });
    }
};
