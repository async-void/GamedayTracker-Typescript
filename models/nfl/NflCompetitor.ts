import type { NflTeam } from "./NflTeam.js";
export interface NflCompetitor {
    id: string;
    homeAway: "home" | "away";
    winner?: boolean;
    score: string;
    team: NflTeam;
}