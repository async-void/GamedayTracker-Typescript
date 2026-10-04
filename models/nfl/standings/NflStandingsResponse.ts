import type { NflSeason } from "../NflSeason.ts";
import type { NflStandings } from "./NflStandings.ts";
import type { NflStandingsEntry } from "./NflStandingsEntry.ts";

export interface NflStandingsResponse {
    uid: string;
    name: string;
    standings: NflStandings;
    season: NflSeason;
    children: NflStandingsEntry[];
}
