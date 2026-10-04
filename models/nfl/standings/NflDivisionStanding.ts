import type { NflTeamStanding } from "./NflTeamStanding.ts";

export interface NflDivisionStanding {
    division: string;
    conference: string;
    teams: NflTeamStanding[];
}