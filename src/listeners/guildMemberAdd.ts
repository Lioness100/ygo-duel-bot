import type { GuildMember } from 'discord.js';
import { ranks } from '../database';

export const onGuildMemberAdd = async (member: GuildMember) => {
	await member.roles.add(ranks[0].role);
};
