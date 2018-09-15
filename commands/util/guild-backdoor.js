// Copyright Jonah Snider 2018

const { Command } = require('discord.js-commando');
const logger = require('../../providers/logger').scope('command', 'guild backdoor');

module.exports = class GuildBackdoorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'guild-backdoor',
      aliases: ['backdoor', 'server-backdoor'],
      group: 'util',
      memberName: 'guild-backdoor',
      description: 'Get an invite to a server.',
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: true,
      args: [{
        'key': 'guild',
        'prompt': 'What server do you want to get a backdoor to?',
        'type': 'string',
        'default': ''
      }]
    });
  }

  async run(msg, { guild }) {
    logger.debug('Provided guild:', guild);
    guild = await this.client.guilds.get(guild);
    logger.debug('Guild after being pulled from this client\'s guilds', guild);
    if (!guild) return msg.reply(`Not a guild ID or a guild ${this.client.user} is on.`);

    const invites = await guild.fetchInvites();
    logger.debug('This guild\'s invites:', invites);
    if (invites.size > 0) {
      return msg.reply(invites.first().url);
    }
    for (const channel of guild.channels.values()) {
      if (channel.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE')) {
        // eslint-disable-next-line no-await-in-loop
        return msg.reply((await channel.createInvite({ maxAge: 0 })).url);
      }
    }

    return msg.reply('No existing invites or channels to invite you to.');
  }
};
