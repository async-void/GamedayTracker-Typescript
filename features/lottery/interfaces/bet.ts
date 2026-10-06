export interface Bet {
    id: string;
    userId: string;
    drawId: string;
    type: BetType;
    amount: number;
    odds: number;
    status: "pending" | "won" | "lost";
    createdAt: Date;
    updatedAt: Date;
}