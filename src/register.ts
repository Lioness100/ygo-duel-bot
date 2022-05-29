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
	)
	.addStringOption((option) =>
		option //
			.setName('type')
			.setDescription('The type of card to display')
			.setChoices(
				{ name: 'Spell', value: 'spell' },
				{ name: 'Trap', value: 'trap' },
				{ name: 'Normal Monster', value: 'normal' },
				{ name: 'Effect Monster', value: 'effect' },
				{ name: 'Ritual Monster', value: 'ritual' },
				{ name: 'Fusion Monster', value: 'fusion' },
				{ name: 'Synchro Monster', value: 'synchro' },
				{ name: 'Xyz Monster', value: 'xyz' },
				{ name: 'Link Monster', value: 'link' },
				{ name: 'Token Monster', value: 'token' }
			)
			.setRequired(false)
	);

const winStreakCommand = new SlashCommandBuilder()
	.setName('duelist-winstreak')
	.setDescription("View your or another user's dueler winstreak")
	.addUserOption((option) =>
		option //
			.setName('user')
			.setDescription('The user you want to view the winstreak of (defaults to yourself)')
			.setRequired(false)
	);

const historyCommand = new SlashCommandBuilder()
	.setName('duel-history')
	.setDescription("View your or another user's duel history")
	.addUserOption((option) =>
		option //
			.setName('user')
			.setDescription('The user you want to view the history of (defaults to yourself)')
			.setRequired(false)
	);

const addWinCommand = new SlashCommandBuilder()
	.setName('duel-win')
	.setDescription('Grant a user a win')
	.addUserOption((option) =>
		option //
			.setName('user')
			.setDescription('The user you want to grant a win to')
			.setRequired(true)
	);

const addLossCommand = new SlashCommandBuilder()
	.setName('duel-loss')
	.setDescription('Grant a user a loss')
	.addUserOption((option) =>
		option //
			.setName('user')
			.setDescription('The user you want to grant a loss to')
			.setRequired(true)
	);

const leaderboardCommand = new SlashCommandBuilder() //
	.setName('duelist-leaderboard')
	.setDescription('View the dueler leaderboard');

const bot = (await rest.get(Routes.user())) as APIUser;

await rest.put(Routes.applicationGuildCommands(bot.id, process.env.GUILD_ID!), {
	body: [duelCommand, rankCommand, historyCommand, addWinCommand, addLossCommand, leaderboardCommand, winStreakCommand]
});
