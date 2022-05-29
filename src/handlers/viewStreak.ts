/* eslint-disable unicorn/no-array-reduce */
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { db } from '../database';

export const viewStreak = async (interaction: CommandInteraction) => {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const history = db.data[user.id]?.history ?? [];
	const streak = [...history].reduce((acc, { won }, _, arr) => (won ? acc + 1 : ((arr.length = 0), acc)), 0);

	const embed = new MessageEmbed().setColor('AQUA').setDescription(`${user} has a winstreak of ${streak}!`);
	await interaction.reply({ embeds: [embed] });
};
