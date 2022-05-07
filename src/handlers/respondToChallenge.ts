/* eslint-disable unicorn/no-array-for-each */
import { type ButtonInteraction, MessageEmbed, type Snowflake, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { userMention } from '@discordjs/builders';

export const respondToChallenge = async (interaction: ButtonInteraction<'cached'>, args: string[]) => {
	const duelAccepted = args[0] === '0';
	const dueler: Snowflake = args[1];
	const dueled: Snowflake = args[2];

	if (interaction.user.id !== dueled) {
		return interaction.reply({ content: "❌ This challenge isn't for you!", ephemeral: true });
	}

	interaction.message.components[0].components.forEach((component) => component.setDisabled(true));
	await interaction.message.edit({ components: interaction.message.components });

	if (!duelAccepted) {
		const embed = new MessageEmbed().setColor('RED').setDescription(`Sorry ${userMention(dueler)}, but ${userMention(dueled)} declined. ⚔️`);
		return interaction.reply({ embeds: [embed] });
	}

	const embed = new MessageEmbed()
		.setColor('AQUA')
		.setTitle('🔔 The duel has begun!')
		.setDescription('Both users must agree on a result for the duel to finish.');

	const duelerUser = await interaction.client.users.fetch(dueler);

	const menu = new MessageSelectMenu()
		.setCustomId('sr-menu')
		.setPlaceholder('Select a result...')
		.setOptions([
			{ label: `${duelerUser.tag} Won (0/2)`, value: `w-${dueler}-${dueled}-`, emoji: '👑' },
			{ label: `${interaction.user.tag} Won (0/2)`, value: `w-${dueled}-${dueler}-`, emoji: '👑' },
			{ label: `Cancel (0/2)`, value: `c-${dueler}-${dueled}-`, emoji: '❌' }
		]);

	const row = new MessageActionRow().setComponents([menu]);
	return interaction.reply({ embeds: [embed], components: [row] });
};
