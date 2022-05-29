/* eslint-disable no-multi-assign */
/* eslint-disable unicorn/no-array-for-each */
import { MessageEmbed, type Snowflake, type SelectMenuInteraction, type MessageSelectMenu } from 'discord.js';
import { userMention } from '@discordjs/builders';
import { db, ranks } from '../database';
import ms from 'pretty-ms';

export const submitResult = async (interaction: SelectMenuInteraction<'cached'>) => {
	const args = interaction.values[0].split('-');

	const winner: Snowflake = args[1];
	const loser: Snowflake = args[2];

	if (interaction.user.id !== winner && interaction.user.id !== loser) {
		return interaction.reply({ content: "❌ This challenge isn't for you!", ephemeral: true });
	}

	const picker = args[3];
	const canceled = args[0] === 'c';

	if (picker && picker !== interaction.user.id) {
		const duration = Date.now() - interaction.message.createdTimestamp;
		const embed = new MessageEmbed()
			.setColor(canceled ? 'RED' : 'AQUA')
			.setTitle('⚔️ The results are in!')
			.setDescription(
				[canceled ? 'The battle was canceled. Nobody won 😭' : `${userMention(winner)} wins! 👑`, `Duel duration: ${ms(duration)}`].join('\n')
			);

		await interaction.reply({ embeds: [embed] });
		await interaction.message.edit({ components: [] });

		if (!canceled) {
			const now = Date.now();
			[winner, loser].forEach(async (id) => {
				const profile = (db.data[id] ??= { gamesPlayed: 0, gamesWon: 0, timeInDuelsSum: 0, history: [] });

				profile.gamesPlayed++;
				profile.timeInDuelsSum += duration;

				if (id === winner) {
					const nextRankIdx = ranks.findIndex(({ wins }) => wins > profile.gamesWon);
					const nextRank = ranks[nextRankIdx];

					profile.gamesWon++;
					profile.history.push({ against: loser, won: true, date: now });

					if (nextRank && nextRank.wins <= profile.gamesWon) {
						const currentRank = ranks[nextRankIdx - 1];

						try {
							const member = await interaction.guild.members.fetch(id);
							await member.roles.remove(currentRank.role);
							await member.roles.add(nextRank.role);

							await interaction.followUp(`${userMention(id)}, you ranked up to a ${nextRank.name}!`);
						} catch {}
					}
				} else {
					profile.history.push({ against: winner, won: false, date: now });
				}
			});

			await db.write();
		}

		return;
	}

	const menu = interaction.message.components[0].components[0] as MessageSelectMenu;
	menu.options.forEach((option) => {
		if (option.value === interaction.values[0] && !picker) {
			option.label = option.label.replace('0/', '1/');
			option.value += interaction.user.id;
		} else if (option.value.endsWith(interaction.user.id)) {
			option.label = option.label.replace('1/', '0/');
			option.value = option.value.slice(0, -interaction.user.id.length);
		}
	});

	await interaction.update({ components: interaction.message.components });
};
