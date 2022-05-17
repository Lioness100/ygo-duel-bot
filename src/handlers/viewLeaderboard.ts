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

	entries.sort(([, a], [, b]) => {
		if (b.gamesWon !== a.gamesWon) {
			return b.gamesWon - a.gamesWon;
		}

		const aRate = a.gamesWon / a.gamesPlayed;
		const bRate = b.gamesWon / b.gamesPlayed;

		if (aRate !== bRate) {
			return bRate - aRate;
		}

		return 0;
	});

	for (const [chunkIdx, entryChunk] of chunk(entries, 10).entries()) {
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
