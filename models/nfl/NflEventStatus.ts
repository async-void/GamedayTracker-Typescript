export interface NflEventStatus {
    type: {
        id: string;
        name: string;
        state: string;  
        completed: boolean;
        description?: string;
        detail?: string;
        shortDetail?: string;
    };
    clock?: number;
    displayClock?: string;
    period?: number;
}