import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const commandsRoot = path.join(__dirname, "commands");

export function loadCommands() {
    const commands: Array<{ data: any; execute: Function }> = [];

    for (const folder of readdirSync(commandsRoot)) {
        const folderPath = path.join(commandsRoot, folder);

        if (!statSync(folderPath).isDirectory()) continue;

        const files = readdirSync(folderPath).filter(f => f.endsWith(".js"));

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // Dynamic import for ESM
            const commandModule = require(filePath);
            const command = commandModule.default ?? commandModule;

            if (!("data" in command) || !("execute" in command)) {
                throw new Error(`The command at ${filePath} is missing "data" or "execute".`);
            }

            commands.push(command);
        }
    }

    return commands;
}
