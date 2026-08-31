import type { Command } from '../command.ts';
import { ping } from './ping.ts';
import { vote } from "./vote.ts";

export const commands: Command[] = [ping, vote];