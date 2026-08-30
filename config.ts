import dotenv from "dotenv"
function required(name: string): string {
    const value = process.env[name];
    if (!value || value.trim() === '') {
        throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`)
    }
    return value;
}

export const DISCORD_TOKEN = required('DISCORD_TOKEN');
export const CLIENT_ID = required('CLIENT_ID');