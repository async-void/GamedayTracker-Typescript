import type { NflCompetitor } from './NflCompetitor.js';
import type { NflOdds } from './NflOdds.js';
import type { NflVenue } from './NflVenue.js';
import type { NflBroadcast } from './NflBroadcast.js';
import type { NflLeader } from './NflLeader.js';
export interface NflCompetition {
    id: string;
    date: string;
    competitors: NflCompetitor[];
    odds?: NflOdds[];
    venue?: NflVenue;
    broadcasts?: NflBroadcast[];
    leaders?: NflLeader[];
}