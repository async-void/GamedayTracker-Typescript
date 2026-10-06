import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

export class DB {
    private static instance: Database.Database;

    static get() {
        if (!DB.instance) {

            const dataDir = path.join(process.cwd(), 'data');
            const dbPath = path.join(dataDir, 'bot.db');

            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir);
            }
            
            DB.instance = new Database(dbPath);

            DB.instance.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    discord_id TEXT PRIMARY KEY,
                    username TEXT NOT NULL,
                    xp INTEGER DEFAULT 0,
                    favorite_team TEXT,
                    wins INTEGER DEFAULT 0,
                    balance INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            DB.instance.exec(`
                CREATE TABLE IF NOT EXISTS bets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    game_id TEXT NOT NULL,
                    amount INTEGER NOT NULL,
                    team TEXT NOT NULL,
                    odds INTEGER NOT NULL,
                    status TEXT CHECK(status IN ('pending', 'won', 'lost')) NOT NULL DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    paid BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY(user_id) REFERENCES users(discord_id)
                );
            `);
        }
        return DB.instance;
    }
}
