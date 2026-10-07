import { ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";

import type { Command } from "../../command.ts";
import type { NflScoreboard } from "../../models/nfl/NflScoreboard.ts";

import { getScoreboard, getCurrentSeason } from "../../espn/espnClient.ts";
import { NflEmojiMapper } from "../../mappers/nflEmojiMapper.ts";

export const scoreboard: Command = {
    data: new SlashCommandBuilder()
        .setName("scoreboard")
        .setDescription("Get the current NFL scoreboard.") as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const json = (await getScoreboard(0,0,0)) as NflScoreboard;
        const season = getCurrentSeason();
        const finals: string[] = [];
        const inProgress: string[] = [];
        const groupedScheduled: Record<string, string[]> = {};
        const dayOrder = ["Thu", "Sun", "Mon", "Tue", "Wed", "Fri", "Sat"];
        let scheduledText = "";

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
                const eastern = "America/New_York";

                const etDay = date.toLocaleDateString("en-US", {
                    timeZone: eastern,
                    weekday: "short"
                });

                line = `${awayEmoji} 🆚 ${homeEmoji} \\|\\| ${day} ${time} ET`;

                if (!groupedScheduled[etDay]) groupedScheduled[etDay] = [];
                groupedScheduled[etDay].push(line);
            }
        }

         for (const d of dayOrder) {
            if (!groupedScheduled[d]) continue;

                scheduledText += `### ${d}\n`;
                scheduledText += groupedScheduled[d].join("\n");
                scheduledText += "\n";
            }

            if (scheduledText.trim().length === 0) {
                scheduledText = "None";
            }

        const fmt = (arr: any[]) => (arr.length > 0 ? arr.join("\n") : "None");

        const container = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# Scoreboard ${season}`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Scheduled Games**\n${scheduledText || "None"}`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**In Progress**\n${fmt(inProgress)}`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Finals**\n${fmt(finals)}`)
        );

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [ container ]
        });
    }
};
