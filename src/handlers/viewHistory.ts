import { type CommandInteraction, MessageEmbed } from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { chunk } from '@sapphire/utilities';
import { db } from '../database';
import { time, TimestampStyles, userMention } from '@discordjs/builders';

export const viewHistory = async (interaction: CommandInteraction) => {
	const user = interaction.options.getUser('user') ?? interaction.user;
	const history = db.data[user.id]?.history;

	if (!history.length) {
		const embed = new MessageEmbed().setColor('RED').setDescription("This user hasn't played any games!");
		return interaction.reply({ embeds: [embed] });
	}

	const labels: string[] = [];
	const handler = new PaginatedMessage({
		template: new MessageEmbed().setColor('AQUA').setTitle(`${user.tag}'s Duel History 👑`)
	}).setSelectMenuOptions((idx) => ({ label: labels[idx] }));

	for (const entryChunk of chunk(history, 10)) {
		handler.addPageEmbed((embed) => {
			const descriptions = entryChunk.map(
				(entry) =>
					`${time(Math.floor(entry.date / 1000), TimestampStyles.ShortDate)} • ${entry.won ? 'Won' : 'Lost'} against ${userMention(
						entry.against
					)}`
			);

			return embed.setDescription(descriptions.join('\n'));
		});

		labels.push(`${new Date(entryChunk[0].date).toLocaleDateString()}-${new Date(entryChunk.at(-1)!.date).toLocaleDateString()}`);
	}

	await handler.run(interaction);
};
