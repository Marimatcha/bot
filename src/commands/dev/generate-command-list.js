/*
Copyright 2019 Jonah Snider

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const SentryCommand = require("../../structures/SentryCommand");
const genCmdURL = require("../../util/genCmdURL");

module.exports = class GenerateCommandListCommand extends SentryCommand {
  constructor(client) {
    super(client, {
      name: "generate-command-list",
      group: "dev",
      memberName: "generate-command-list",
      description: "Creates a Markdown table of all commands.",
      details: "Only the bot owner(s) may use this command.",
      aliases: [
        "command-list",
        "cmd-list",
        "make-command-list",
        "make-cmd-list",
        "gen-cmd-list",
        "gen-command-list",
        "generate-cmd-list"
      ],
      throttling: {
        usages: 2,
        duration: 15
      },
      ownerOnly: true
    });
  }

  exec(msg) {
    const { groups } = this.client.registry;

    msg.say(
      groups
        .filter(grp => grp.commands)
        .map(
          grp =>
            `${grp.commands
              .filter(cmd => !cmd.ownerOnly)
              .map(cmd => `|[\\\`${cmd.name}\\\`](${genCmdURL(cmd)})|${cmd.description}|${cmd.group.name}|`)
              .join("\n")}`
        ),
      { split: true }
    );
  }
};
