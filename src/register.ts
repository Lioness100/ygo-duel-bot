import 'dotenv/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes, type APIUser } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

const duelCommand = new SlashCommandBuilder()
	.setName('duel')
	.setDescription('Duel another user')
	.addUserOption((option) =>
		option //
			.setName('user')
			.setDescription('The user you want to duel')
			.setRequired(true)
	);

const rankCommand = new SlashCommandBuilder()
	.setName('duelist-rank')
	.setDescription("View your or another user's dueler rank")
	.addUserOption((option) =>
		option //
			.setName('user')
			.setDescription('The user you want to view the rank of (defaults to yourself)')
			.setRequired(false)
	);

const leaderboardCommand = new SlashCommandBuilder() //
	.setName('duelist-leaderboard')
	.setDescription('View the dueler leaderboard');

const bot = (await rest.get(Routes.user())) as APIUser;

await rest.put(Routes.applicationGuildCommands(bot.id, process.env.GUILD_ID!), {
	body: [duelCommand, rankCommand, leaderboardCommand]
});
