// Load variables from .env file into `process.env`
import 'dotenv/config';

import { Client, Collection, Intents, LimitedCollection } from 'discord.js';
import { onInteractionCreate } from './listeners/interactionCreate';
import { onGuildMemberAdd } from './listeners/guildMemberAdd';

const necessaryManagers = new Set([
	'GuildManager', //
	'GuildChannelManager',
	'ChannelManager',
	'RoleManager',
	'PermissionOverwriteManager'
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
