import type { NflStandingsTable } from "./NflStandingsTable.ts";

   export interface NflStandingsGroup {
    uid?: string;
    id?: string;
    name?: string;
    abbreviation?: string;
    isConference?: boolean;
    standings?: NflStandingsTable;
    children?: NflStandingsGroup[];
}

