const { Command } = require('discord.js-commando');
const winston = require('winston');

module.exports = class feedback extends Command {
	constructor(client) {
		super(client, {
			name: 'feedback',
			aliases: ['bug-report', 'feed-back', 'suggest', 'suggestion'],
			group: 'util',
			memberName: 'feedback',
			description: 'Submit bugs and suggestions to the developer',
			examples: ['feedback When I use `$dice` the bot lags.'],
			args: [
				{
					key: 'userFeedback',
					prompt: 'What is your feedback you want to report?',
					type: 'string',
				},
			],
		});
	}

	run(msg, { userFeedback }) {
		const message = '📝 Thanks for sending your feedback.';
		if (userFeedback.includes('help') || userFeedback.includes('support')) {
			// prettier-ignore
			msg.reply(`${message} If you need help with a problem use the \`support\` command.`);
		} else {
			msg.reply(message);
		}

		winston.debug('[COMMAND](FEEDBACK) About to send RichEmbed');

		const developer = this.client.users.resolve('210024244766179329');
		// Pizza Fox#0075
		return developer.send({
			embed: {
				author: {
					name: msg.author.tag,
					icon_url: msg.author.displayAvatarURL(128),
				},
				timestamp: new Date(msg.createdTimestamp),
				fields: [
					{
						name: 'Message',
						value: userFeedback,
					},
				],
			},
		});
	}
};
