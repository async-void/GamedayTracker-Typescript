export interface NflLeader {
    category: string;
    leaders: {
        athlete: {
            id: string;
            displayName: string;
            shortName: string;
            headshot?: string;
            position?: string;
        };
        value: number;
    }[];
}