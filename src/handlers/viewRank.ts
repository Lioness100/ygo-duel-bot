import type { CommandInteraction } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { db, ranks } from '../database';
import Canvas from 'canvas';
import ms from 'pretty-ms';

Canvas.registerFont('./assets/fonts/Matrix Small Caps.ttf', { family: 'Matrix Small Caps', style: 'normal', weight: 'normal' });
Canvas.registerFont('./assets/fonts/Stone Serif LT Italic.ttf', { family: 'Stone Serif LT Italic', style: 'italic', weight: 'medium' });
Canvas.registerFont('./assets/fonts/Stone Serif Small Caps.ttf', { family: 'Stone Serif Small Caps', style: 'bold', weight: 'bold' });
Canvas.registerFont('./assets/fonts/Stone Serif.ttf', { family: 'Stone Serif', style: 'bold', weight: 'bold' });

const attributes = await readdir('./assets/images/attributes');
const star = await Canvas.loadImage('./assets/images/star.png');

export const viewRank = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	const user = interaction.options.getUser('user') ?? interaction.user;
	const card = await Canvas.loadImage('./assets/images/card.png');

	const canvas = Canvas.createCanvas(card.width, card.height);
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, card.width, card.height);

	const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 4096 }));
	ctx.drawImage(squareImage(avatar), 98, 217, 617, 617);
	ctx.drawImage(card, 0, 0);

	const attribute = await Canvas.loadImage(`./assets/images/attributes/${attributes[Math.floor(Math.random() * attributes.length)]}`);
	ctx.drawImage(attribute, 686, 55, 70, 70);

	const profile = db.data[user.id] ?? { gamesPlayed: 0, gamesWon: 0, timeInDuelsSum: 0 };
	// eslint-disable-next-line unicorn/no-array-reduce
	const rankIdx = ranks.findIndex(({ wins }) => wins > profile.gamesWon) - 1;

	for (let i = 0; i <= rankIdx; i++) {
		const levelX = 686 - 50 * i - 5 * i;
		ctx.drawImage(star, levelX, 141, 50, 50);
	}

	ctx.fillStyle = 'black';
	ctx.textBaseline = 'top';

	ctx.font = 'normal normal 87px Matrix Small Caps';
	ctx.fillText(user.tag, 60, 57, 620);

	ctx.font = 'bold bold 31px Stone Serif Small Caps';
	const rankName = `[ ${ranks[rankIdx].name} ]`;
	ctx.fillText(rankName, 60, 894);

	ctx.font = 'bold bold 29px Stone Serif';

	const atkDef = Math.min((rankIdx + 1) * 1000, 9999).toString();
	ctx.fillText(atkDef, 514, 1079);
	ctx.fillText(atkDef, 675, 1079);

	ctx.font = 'italic medium 27px Stone Serif LT Italic';
	const nextRank = ranks[rankIdx + 1];

	const effect = [
		`Win Ratio: ${profile.gamesWon}/${profile.gamesPlayed} (${Number.parseFloat(
			((profile.gamesWon / profile.gamesPlayed) * 100 || 0).toFixed(2)
		)}%)`,
		`Total Time Dueling: ${profile.timeInDuelsSum ? ms(profile.timeInDuelsSum) : 'None'}`,
		`In ${nextRank.wins - profile.gamesWon} wins, the user will rank up to a ${nextRank.name}!`
	].join('\n');

	ctx.fillText(effect, 63, 933);
	return void (await interaction.editReply({ files: [{ attachment: canvas.toBuffer(), name: 'rank.png' }] }));
};

const squareImage = (image: Canvas.Image) => {
	const dimensions = Math.min(image.width, image.height);
	const canvas = Canvas.createCanvas(dimensions, dimensions);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, canvas.width / 2 - image.width / 2, 0);

	return canvas;
};
