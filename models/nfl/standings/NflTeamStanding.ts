import type { NflTeam } from "../NflTeam.ts";

export interface NflTeamStanding {
    team: NflTeam;
    wins: number;
    losses: number;
    ties: number;
}