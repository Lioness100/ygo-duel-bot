import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Element, load } from 'cheerio';
import { MessageEmbed } from 'discord.js';

export const fetchTierList = async (type: 'dl' | 'md') => {
	const url = type === 'dl' ? 'https://www.duellinksmeta.com/tier-list' : 'https://www.masterduelmeta.com/tier-list';
	const tiers: Record<string, string[]> = {};

	const text = await fetch(url, FetchResultTypes.Text);
	const $ = load(text);

	$('img[alt^="Tier"]')
		.slice(0, 3)
		.each((_, res) => {
			tiers[res.attribs.alt] = (res.parent!.parent!.children[4] as Element).children
				.filter((child) => child.type === 'tag')
				.map(
					(child) =>
						(
							((((child as Element).children[0] as Element).children[0] as Element).children[2] as Element).children[0] as Element & {
								data: string;
							}
						).data
				);
		});

	return tiers;
};

const types = {
	md: 'Master Duel',
	dl: 'Duel Links'
};

export const makeEmbed = (type: 'md' | 'dl', tiers: Record<string, string[]>) => {
	const embed = new MessageEmbed().setColor('AQUA').setTitle(`Updated Tier List for ${types[type]}`);
	for (const [idx, [tier, cards]] of Object.entries(tiers).entries()) {
		embed.addField(`${['🥇', '🥈', '🥉'][idx]} Tier ${tier}`, cards.join('\n'), true);
	}

	return embed;
};
