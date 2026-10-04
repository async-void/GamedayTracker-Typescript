import type { NflTeam } from "../NflTeam.ts";
import type { NflStandingStat } from "./NflStandingStat.ts";

export interface NflStandingsEntry {
    team: NflTeam;
    stats: NflStandingStat[];
}