import type { Command } from '../command.ts';
import { ping } from './ping.ts';
import { vote } from "./vote.ts";
import { tag } from "./tag.ts";
import { scoreboard } from "./nfl/scoreboard.ts";
import { standings } from './nfl/standings.ts';

export const commands: Command[] = [ping, vote, tag, scoreboard, standings];