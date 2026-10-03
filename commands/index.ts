import type { Command } from '../command.ts';
import { ping } from './ping.ts';
import { vote } from "./vote.ts";
import { tag } from "./tag.ts";
import { scoreboard } from "./nfl/scoreboard.ts";

export const commands: Command[] = [ping, vote, tag, scoreboard];