import { ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";
import type { Command } from "../../command.ts";
import { getSeason, getStandings, toConferenceRows } from "../../espn/espnClient.ts";
import { formatFlatStandings } from "../../helpers/formatter.ts";
import { NflEmojiMapper } from "../../mappers/nflEmojiMapper.ts";

export const standings: Command = {
    data: new SlashCommandBuilder()
        .setName("standings")
        .setDescription("Show the current NFL standings") as SlashCommandBuilder,

async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
 
    const raw = await getStandings();
    const conferences = toConferenceRows(raw);
    const season = getSeason(raw);
    const nflEmoji = NflEmojiMapper.get("NFL");

    const container = new ContainerBuilder()
    .setAccentColor(0x013369)
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `## ${nflEmoji} NFL Standings${season ? `\n-# ${season} season` : ""}`,
        ),
    );

for (const conf of conferences) {
    const confEmoji = NflEmojiMapper.get(conf.abbreviation);
    container
        .addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small),
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `### ${confEmoji} ${conf.name}\n${formatFlatStandings(conf.rows)}`,
            ),
        );
    }
    await interaction.editReply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });

  }
}
