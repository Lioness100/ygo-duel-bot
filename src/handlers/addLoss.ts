/* eslint-disable no-multi-assign */
import { db, ranks } from '../database';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export const addLoss = async (interaction: CommandInteraction) => {
	const user = interaction.options.getUser('user', true);
	const profile = (db.data[user.id] ??= { gamesPlayed: 0, gamesWon: 0, timeInDuelsSum: 0, history: [] });

	let rankIdx = ranks.findIndex(({ wins }) => wins > profile.gamesWon) - 1;
	if (rankIdx === -2) {
		rankIdx = ranks.length - 1;
	}

	profile.gamesWon--;

	let newRankIdx = ranks.findIndex(({ wins }) => wins > profile.gamesWon) - 1;
	if (newRankIdx === -2) {
		newRankIdx = ranks.length - 1;
	}

	await db.write();

	if (rankIdx !== newRankIdx) {
		const member = await interaction.guild!.members.fetch(user.id);
		await member.roles.remove(ranks[rankIdx].role);
		await member.roles.add(ranks[newRankIdx].role);
	}

	const embed = new MessageEmbed().setColor('AQUA').setDescription(`${user} now has ${profile.gamesWon} wins!`);
	await interaction.reply({ embeds: [embed] });
};
