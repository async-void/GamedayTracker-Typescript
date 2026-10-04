import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

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
                line = `${awayEmoji} @ ${homeEmoji} || Final`;
                finals.push(line);

            } else if (state === "in") {
                // IN PROGRESS → show score
                line = `${awayEmoji} @ ${homeEmoji} || ${away.score}–${home.score}`;
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

                line = `${awayEmoji} @ ${homeEmoji} || ${day} ${time} ET`;
                scheduled.push(line);
            }
        }
        var msg = `**NFL Scoreboard** \t Scheduled Games ${scheduled.length > 0 ? `\n${scheduled.join("\n")}` : "None"} \n\n **In Progress** ${inProgress.length > 0 ? `\n${inProgress.join("\n")}` : "None"} \n\n **Finals** ${finals.length > 0 ? `\n${finals.join("\n")}` : "None"}`;
        await interaction.editReply(msg);
    }
};
