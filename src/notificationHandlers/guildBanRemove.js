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

const { MessageEmbed } = require("discord.js");
const wait = require("../util/wait");

/**
 * Announces the unbanning of a user on a guild
 * @param {TextChannel} channel Channel to send the embed
 * @param {User} user User who was unbanned
 */
module.exports = async (channel, user) => {
  const embed = new MessageEmbed({
    title: `${user.tag} was unbanned`,
    author: {
      name: `${user.tag} (${user.id})`,
      iconURL: user.displayAvatarURL(128)
    },
    color: 0x4caf50,
    thumbnail: { url: "https://dice.js.org/images/status/banUnban/unban.png" }
  });

  if (channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
    // Hope that Discord has updated the audit log
    await wait(1000);

    const auditLogs = await channel.guild.fetchAuditLogs({
      type: "MEMBER_BAN_REMOVE"
    });
    const auditEntry = auditLogs.entries.first();

    if (auditEntry.reason) embed.addField("Reason", auditEntry.reason);
    embed.setTimestamp(auditEntry.createdAt);
    embed.setFooter(
      `Unbanned by ${auditEntry.executor.tag} (${auditEntry.executor.id})`,
      auditEntry.executor.displayAvatarURL(128)
    );
  } else {
    embed.setFooter("Give me permissions to view the audit log and more information will appear");
    embed.setTimestamp(new Date());
  }

  channel.send({ embed });
};
