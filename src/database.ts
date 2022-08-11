import type { Snowflake } from 'discord.js';
import { Low, JSONFile } from 'lowdb';
import { readFile } from 'node:fs/promises';

export interface HistoryEntry {
	against: Snowflake;
	won: boolean;
	date: number;
}

export interface Profile {
	gamesWon: number;
	gamesPlayed: number;
	timeInDuelsSum: number;
	cardType?: string;
	history: HistoryEntry[];
}

const adapter = new JSONFile('./assets/json/users.json');
const db = new Low(adapter) as Exclude<Low, 'data'> & { data: Record<Snowflake, Profile> };

await db.read();
db.data ??= {};

export { db };
export const ranks: { name: string; role: Snowflake; wins: number }[] = JSON.parse(await readFile('./assets/json/ranks.json', 'utf8'));

const adapter2 = new JSONFile('./assets/json/users.json');
const tiers = new Low(adapter2) as Exclude<Low, 'data'> & { data: Record<'md' | 'dl', Record<string, string[]>> };

await tiers.read();
tiers.data ??= { md: {}, dl: {} };

export { tiers };
