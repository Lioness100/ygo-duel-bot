// Load variables from .env file into `process.env`
import 'dotenv/config';

import { Client, Collection, Intents, LimitedCollection } from 'discord.js';
import { onInteractionCreate } from './listeners/interactionCreate';
import { onGuildMemberAdd } from './listeners/guildMemberAdd';
import { fetchTierList, makeEmbed } from './utils/getTierList';
import { tiers } from './database';

const necessaryManagers = new Set([
	'GuildManager', //
	'GuildChannelManager',
	'ChannelManager',
	'RoleManager',
	'PermissionOverwriteManager',
	'MessageManager'
]);

const client = new Client({
	// https://discordjs.guide/popular-topics/intents.html
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
	// This function specifies what data structures to hold in cache (since they can be very big). Even though we don't
	// use most of them, discord.js's internals require the 5 listed in `necessaryManagers` (for now).
	makeCache: (manager) => {
		if (necessaryManagers.has(manager.name)) {
			return new Collection();
		}

		return new LimitedCollection({ maxSize: 0 });
	}
});

client //
	.on('ready', () => console.log('Online!'))
	.on('guildMemberAdd', onGuildMemberAdd)
	.on('interactionCreate', onInteractionCreate);

await client.login();

setInterval(async () => {
	for (const type of ['md', 'dl'] as const) {
		const fetched = await fetchTierList(type);
		const db = tiers.data[type];

		if (JSON.stringify(fetched) === JSON.stringify(db.tiers)) {
			return;
		}

		// eslint-disable-next-line no-const-assign
		tiers.data[type] = fetched;
		await tiers.write();

		const channel = client.channels.cache.get(process.env.TIER_LIST_CHANNEl!);
		if (channel?.isText()) {
			await channel.send({ embeds: [makeEmbed(type, fetched)] });
		}
	}
}, 1000 * 60 * 60 * 24);
