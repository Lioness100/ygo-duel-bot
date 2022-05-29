/* eslint-disable no-multi-assign */
import { db, ranks } from '../database';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export const addWin = async (interaction: CommandInteraction) => {
	const user = interaction.options.getUser('user', true);
	const profile = (db.data[user.id] ??= { gamesPlayed: 0, gamesWon: 0, timeInDuelsSum: 0, history: [] });

	const nextRankIdx = ranks.findIndex(({ wins }) => wins > profile.gamesWon);
	const nextRank = ranks[nextRankIdx];

	profile.gamesWon++;

	if (nextRank && nextRank.wins <= profile.gamesWon) {
		const currentRank = ranks[nextRankIdx - 1];

		const member = await interaction.guild!.members.fetch(user.id);
		await member.roles.remove(currentRank.role);
		await member.roles.add(nextRank.role);
	}

	await db.write();

	const embed = new MessageEmbed().setColor('AQUA').setDescription(`${user} now has ${profile.gamesWon} wins!`);
	await interaction.reply({ embeds: [embed] });
};
