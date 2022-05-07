import { type CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';

export const startDuel = (interaction: CommandInteraction) => {
	const user = interaction.options.getUser('user', true);
	if (user.id === interaction.user.id) {
		return interaction.reply({ content: "❌ You can't duel yourself!", ephemeral: true });
	}

	if (user.bot) {
		return interaction.reply({ content: "❌ You can't duel a bot!", ephemeral: true });
	}

	const acceptButton = new MessageButton().setCustomId(`rtc-0-${interaction.user.id}-${user.id}`).setStyle('SUCCESS').setLabel('Accept');
	const declineButton = new MessageButton().setCustomId(`rtc-1-${interaction.user.id}-${user.id}`).setStyle('DANGER').setLabel('Decline');
	const buttonRow = new MessageActionRow().setComponents([acceptButton, declineButton]);

	const embed = new MessageEmbed()
		.setColor('AQUA')
		.setTitle('🔔 New challenge request!')
		.setDescription(`${user}, you've been challenged to a duel by ${interaction.user}! Do you accept? ⚔️`);

	return interaction.reply({ embeds: [embed], components: [buttonRow] });
};
