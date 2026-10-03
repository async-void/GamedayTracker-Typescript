import type { NflCompetition } from './NflCompetition.js';
import type { NflEventStatus } from './NflEventStatus.js';
export interface NflEvent {
    id: string;
    uid: string;
    date: string;
    name: string;
    shortName: string;
    competitions: NflCompetition[];
    status: NflEventStatus;     
}