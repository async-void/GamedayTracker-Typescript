import type { Command } from '../command.ts';
import { ping } from './ping.ts';

export const commands: Command[] = [ping];