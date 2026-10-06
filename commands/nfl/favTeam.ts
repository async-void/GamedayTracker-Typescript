import { ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import type { Command } from "../../command.ts";
import { NflEmojiMapper } from "../../mappers/nflEmojiMapper.ts";
export const favTeam: Command = {
    data: new SlashCommandBuilder()
        .setName("favoriteteam")
        .setDescription("Set your favorite NFL team.")
        .addStringOption(option =>
            option
                .setName("team")
                .setDescription("The NFL team you want to set as your favorite. ie 'NE' for New England Patriots.")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const team = interaction.options.getString("team", true);
        const teamEmoji = NflEmojiMapper.get(team);
        
        if (!NflEmojiMapper.has(team)) {
            await interaction.editReply({ content: `Invalid team abbreviation: ${team}. Please provide a valid NFL team abbreviation.` });
            return;
        }
        const db = (await import("../../store/db.ts")).DB.get();
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const favTeam = await getFavoriteTeam(userId);

        if (favTeam) {
            await interaction.editReply({ content: `Your favorite team is already set to ${favTeam}. Updating to ${teamEmoji}.` });
        }
        db.prepare(`
            INSERT INTO users (discord_id, username, favorite_team)
            VALUES (?, ?, ?)
            ON CONFLICT(discord_id) 
            DO UPDATE SET favorite_team = excluded.favorite_team
        `).run(userId, username, team);

        const seperatorComp = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);
        const title = new TextDisplayBuilder().setContent("## Favorite Team");
        const section = new SectionBuilder()
            .addTextDisplayComponents(title)
            .setThumbnailAccessory(new ThumbnailBuilder().setURL(`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${team}.png`));

        await interaction.editReply({
            components: [title, seperatorComp, section],
            flags: MessageFlags.IsComponentsV2
        });
    }
};

async function getFavoriteTeam(userId: string): Promise<string | null> {
    const db = (await import("../../store/db.ts")).DB.get();
    const row = db
        .prepare("SELECT favorite_team FROM users WHERE discord_id = ?")
        .get(userId) as { favorite_team: string } | undefined;

    return row?.favorite_team ?? null;
}

function components(section: SectionBuilder): ContainerBuilder {
    return new ContainerBuilder().addSectionComponents(section);
}
