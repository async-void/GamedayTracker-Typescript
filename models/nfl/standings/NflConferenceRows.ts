import type { NflStandingRow } from "./NflStandingRow.ts";

export interface NflConferenceRows {
    name: string;
    abbreviation: string;
    rows: NflStandingRow[];
}