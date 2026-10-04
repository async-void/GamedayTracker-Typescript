import type { NflStandingsEntry } from "./NflStandingsEntry.ts";

export interface NflStandingsTable {
    id?: string;
    name?: string;
    displayName?: string;
    season?: number;
    seasonType?: number;
    seasonDisplayName?: string;
    entries?: NflStandingsEntry[];
}
