export interface Bet {
    id: number;
    user_id: string;
    game_id: string;
    amount: number;
    team: string;
    odds: number;
    status: 'pending' | 'won' | 'lost';
    created_at: string;
    paid: boolean;
}