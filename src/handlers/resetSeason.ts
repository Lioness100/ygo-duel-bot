import { db } from '../database';
import { CommandInteraction, Guild, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export const resetSeason = async (interaction: CommandInteraction) => {
	if (interaction.user.id !== (interaction.guild as Guild).ownerId) {
		return;
	}

	const confirmButton = new MessageButton().setCustomId('yes').setLabel('Yes').setStyle('SUCCESS');
	const cancelButton = new MessageButton().setCustomId('no').setLabel('No').setStyle('DANGER');

	const row = new MessageActionRow().setComponents([confirmButton, cancelButton]);

	const embed = new MessageEmbed().setColor('AQUA').setDescription(`Are you sure you want to reset the season?`);
	const reply = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true, fetchReply: true });

	const collected = await (reply as Message).awaitMessageComponent({ filter: (i) => i.user.id === interaction.user.id, componentType: 'BUTTON' });
	if (collected.customId === 'no') {
		return void (await interaction.editReply({
			embeds: [(reply.embeds[0] as MessageEmbed).setDescription('Canceled').setColor('RED')],
			components: []
		}));
	}

	db.data = {};
	await db.write();

	await interaction.editReply({
		embeds: [(reply.embeds[0] as MessageEmbed).setDescription('Season has been reset')],
		components: []
	});
};
