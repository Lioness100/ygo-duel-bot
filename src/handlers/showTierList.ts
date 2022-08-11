import type { CommandInteraction } from 'discord.js';
import { fetchTierList, makeEmbed } from '../utils/getTierList';

export const showTierList = async (interaction: CommandInteraction, type: 'md' | 'dl') => {
	const tiers = await fetchTierList(type);
	await interaction.reply({ embeds: [makeEmbed(type, tiers)] });
};
