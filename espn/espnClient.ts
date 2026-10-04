import type { NflScoreboard } from "../models/nfl/NflScoreboard.ts";
import type { NflConferenceRows } from "../models/nfl/standings/NflConferenceRows.ts";
import type { NflStandingRow } from "../models/nfl/standings/NflStandingRow.ts";
import type { NflStandingsEntry } from "../models/nfl/standings/NflStandingsEntry.ts";
import type { NflStandingsGroup } from "../models/nfl/standings/NflStandingsGroup.ts";
import type { NflStandingsResponse } from "../models/nfl/standings/NflStandingsResponse.ts";
import type { NflStandingsRoot } from "../models/nfl/standings/NflStandingsRoot.ts";

const STANDINGS_BASE = `https://site.api.espn.com/apis/v2/sports/football/nfl/standings`;
const SCOREBOARD_BASE = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`;
export async function getScoreboard(season: number, week: number, seasonType: number): Promise<NflScoreboard> {

    const noParams = !season && !week && !seasonType;
    const url = noParams ? SCOREBOARD_BASE : `${SCOREBOARD_BASE}?season=${season}&week=${week}&seasontype=${seasonType}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch scoreboard data: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<NflScoreboard>;
}

export async function getStandings(season?: number, level: 1|2|3 = 3): Promise<NflStandingsRoot> {
    const url = new URL(STANDINGS_BASE);
    url.searchParams.set("region", "us");
    url.searchParams.set("lang", "en");
    url.searchParams.set("contentorigin", "espn");
    url.searchParams.set("type", "0");
    url.searchParams.set("level", String(level));
    if (season !== undefined) url.searchParams.set("season", String(season));

    const response = await fetch(STANDINGS_BASE);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`ESPN standings request failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as NflStandingsRoot;

}

export function collectEntries(root: NflStandingsGroup): NflStandingsEntry[] {
    const seen = new Map<string, NflStandingsEntry>();
 
    const walk = (node: NflStandingsGroup): void => {
        for (const entry of node.standings?.entries ?? []) {
            if (entry?.team && !seen.has(entry.team.id)) {
                seen.set(entry.team.id, entry);
            }
        }
        node.children?.forEach(walk);
    };
 
    walk(root);
    return [...seen.values()];
}


export function getSeason(node: NflStandingsGroup): number | undefined {
    if (node.standings?.season !== undefined) return node.standings.season;
    for (const child of node.children ?? []) {
        const season = getSeason(child);
        if (season !== undefined) return season;
    }
    return undefined;
}


function winPct(r: NflStandingRow): number {
    const games = r.wins + r.losses + r.ties;
    return games === 0 ? 0 : (r.wins + r.ties / 2) / games;
}

function entriesToRows(entries: NflStandingsEntry[]): NflStandingRow[] {
    return entries
        .map((entry): NflStandingRow => {
            const stat = (name: string): number =>
                entry.stats?.find(s => s.name === name)?.value ?? 0;

            return {
                teamId: entry.team.id,
                abbreviation: entry.team.abbreviation,
                wins: stat("wins"),
                losses: stat("losses"),
                ties: stat("ties"),
            };
        })
        .sort((a, b) => winPct(b) - winPct(a) || b.wins - a.wins);
}

export function toRows(root: NflStandingsRoot): NflStandingRow[] {
    return entriesToRows(collectEntries(root));
}

export function toConferenceRows(root: NflStandingsRoot): NflConferenceRows[] {
    return (root.children ?? [])
        .map(conf => ({
            name: conf.name ?? "Unknown",
            abbreviation: conf.abbreviation ?? conf.name ?? "?",
            rows: entriesToRows(collectEntries(conf)),
        }))
        .filter(conf => conf.rows.length > 0);
}

