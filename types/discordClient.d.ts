import "discord.js";
import { Collection } from "discord.js";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>;
        buttons: Collection<string, any>;
        selectMenus: Collection<string, any>;
        modals: Collection<string, any>;
    }
}
