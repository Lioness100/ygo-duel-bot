import { type CommandInteraction, MessageEmbed } from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { chunk } from '@sapphire/utilities';
import { db } from '../database';
import { userMention } from '@discordjs/builders';

export const viewLeaderboard = async (interaction: CommandInteraction) => {
	const entries = Object.entries(db.data);
	if (!entries.length) {
		const embed = new MessageEmbed().setColor('RED').setDescription("Nobody's on the leaderboard!");
		return interaction.reply({ embeds: [embed] });
	}

	const handler = new PaginatedMessage({ template: new MessageEmbed().setColor('AQUA').setTitle('Duelist Leaderboard 👑') }).setSelectMenuOptions(
		(idx) => ({ label: `Ranks ${(idx - 1) * 10} to ${idx * 10}`, emoji: [undefined, '🥇', '🥈', '🥉'][idx] })
	);

	for (const [chunkIdx, entryChunk] of chunk(
		entries.sort(([, { gamesWon: a }], [, { gamesWon: b }]) => b - a),
		10
	).entries()) {
		handler.addPageEmbed((embed) => {
			const descriptions = entryChunk.map(([id, profile], idx) => {
				const prefixDisplay = (chunkIdx ? undefined : ['🥇', '🥈', '🥉'][idx]) ?? `${idx + 1 + chunkIdx * 10}.`;
				const gamesInfoDisplay = `${profile.gamesWon} wins \`(${Number.parseFloat(
					((profile.gamesWon / profile.gamesPlayed) * 100 || 0).toFixed(2)
				)}%)\``;

				return `${prefixDisplay} ${userMention(id)} • ${gamesInfoDisplay}`;
			});

			return embed.setDescription(descriptions.join('\n'));
		});
	}

	await handler.run(interaction);
};
