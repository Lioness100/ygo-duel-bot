/* eslint-disable unicorn/prefer-switch */
import type { Interaction } from 'discord.js';
import { respondToChallenge } from '../handlers/respondToChallenge';
import { viewLeaderboard } from '../handlers/viewLeaderboard';
import { submitResult } from '../handlers/submitResult';
import { startDuel } from '../handlers/startDuel';
import { viewRank } from '../handlers/viewRank';
import { viewHistory } from '../handlers/viewHistory';
import { addWin } from '../handlers/addWin';
import { addLoss } from '../handlers/addLoss';
import { viewStreak } from '../handlers/viewStreak';
import { showTierList } from '../handlers/showTierList';
import { resetSeason } from '../handlers/resetSeason';

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
			} else if (interaction.commandName === 'duel-history') {
				await viewHistory(interaction);
			} else if (interaction.commandName === 'duelist-winstreak') {
				await viewStreak(interaction);
			} else if (interaction.commandName === 'duel-win') {
				await addWin(interaction);
			} else if (interaction.commandName === 'duel-loss') {
				await addLoss(interaction);
			} else if (interaction.commandName === 'duelist-rank') {
				await viewRank(interaction);
			} else if (interaction.commandName === 'duelist-leaderboard') {
				await viewLeaderboard(interaction);
			} else if (interaction.commandName === 'duel-season-reset') {
				await resetSeason(interaction);
			} else if (interaction.commandName.startsWith('tier-list-')) {
				await showTierList(interaction, interaction.commandName.split('-')[2] as 'md' | 'dl');
			}
		}
	} catch (error) {
		console.error(error);
	}
};
