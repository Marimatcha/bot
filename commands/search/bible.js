// Copyright 2018 Jonah Snider

const { Command } = require('discord.js-commando');
const rp = require('request-promise-native');
const logger = require('../../providers/logger').scope('command', 'bible');
const truncateText = require('../../util/truncateText');

module.exports = class BibleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bible',
      group: 'search',
      memberName: 'bible',
      description: 'Get any bible verse from the World English Bible',
      examples: ['bible john 3 16', 'bible jn 3 16'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 1,
        duration: 4
      },
      args: [{
        key: 'book',
        prompt: 'What book name do you want to get a verse from?',
        type: 'string',
        label: 'book name'
      }, {
        key: 'chapter',
        prompt: 'Which chapter do you want to get a verse from?',
        type: 'integer',
        min: 1
      }, {
        key: 'verse',
        prompt: 'Which verse do you want to get from the chapter?',
        type: 'integer',
        min: 1
      }]
    });
  }

  run(msg, { book, chapter, verse }) {
    try {
      msg.channel.startTyping();

      rp({
        uri: `https://bible-api.com/${book} ${chapter}:${verse}`,
        json: true,
        resolveWithFullResponse: true
      })
        .then(response => {
          const data = response.body;

          return msg.replyEmbed({
            title: data.reference,
            author: {
              name: 'World English Bible',
              url: 'https://bible-api.com/'
            },
            description: truncateText(data.text)
          });
        })
        .catch(err => {
          logger.error(err);
          if (err.statusCode === 404) {
            return msg.reply('That bible verse couldn\'t be found.');
          }
          return msg.reply('There was an error with the service to get bible verses we use (https://bible-api.com)');
        });
    } finally {
      msg.channel.stopTyping();
    }
  }
};
