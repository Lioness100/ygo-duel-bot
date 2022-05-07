/* eslint-disable unicorn/prefer-switch */
import type { Interaction } from 'discord.js';
import { respondToChallenge } from '../handlers/respondToChallenge';
import { viewLeaderboard } from '../handlers/viewLeaderboard';
import { submitResult } from '../handlers/submitResult';
import { startDuel } from '../handlers/startDuel';
import { viewRank } from '../handlers/viewRank';

export const onInteractionCreate = async (interaction: Interaction) => {
	if (!interaction.inCachedGuild()) {
		return;
	}

	try {
		if (interaction.isButton()) {
			const [name, ...args] = interaction.customId.split('-');
			if (name === 'rtc') {
				await respondToChallenge(interaction, args);
			}
		} else if (interaction.isSelectMenu()) {
			if (interaction.customId === 'sr-menu') {
				await submitResult(interaction);
			}
		} else if (interaction.isCommand()) {
			if (interaction.commandName === 'duel') {
				await startDuel(interaction);
			} else if (interaction.commandName === 'duelist-rank') {
				await viewRank(interaction);
			} else if (interaction.commandName === 'duelist-leaderboard') {
				await viewLeaderboard(interaction);
			}
		}
	} catch (error) {
		console.error(error);
	}
};
