import { NflEmojiMapper } from "../mappers/nflEmojiMapper.ts";
import type { NflStandingRow } from "../models/nfl/standings/NflStandingRow.ts";

export function formatFlatStandings(rows: NflStandingRow[]): string {
    if (rows.length === 0) return "No standings data available.";

    const header = `${"Team".padEnd(4)} ${"W".padStart(2)} ${"L".padStart(2)} ${"T".padStart(2)}`;
    let out = `__\`${header}\`__\n`;

    for (const t of rows) {
        const abbr = t.abbreviation.padEnd(4, " ");
        const w = String(t.wins).padStart(2, " ");
        const l = String(t.losses).padStart(2, " ");
        const ti = String(t.ties).padStart(2, " ");
        out += `\`${abbr} ${w} ${l} ${ti}\`\n`;
    }
    return out.trim();
}


