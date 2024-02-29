import { Buffer } from 'node:buffer';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export const log = console.log;
export const error = console.error;

export const bufferController = (
  data: string,
  id: number,
  requestId: number,
) => {
  const len = Buffer.byteLength(data, 'ascii');
  const utf8len = Buffer.byteLength(data, 'utf-8');
  const buffer = Buffer.alloc(utf8len + 14);
  buffer.writeInt32LE(utf8len + 4, 0);
  buffer.writeInt32LE(id, 4);
  buffer.writeInt32LE(requestId, 8);
  buffer.write(data, 12, 'utf-8');
  buffer.writeInt16LE(0, 12 + utf8len);

  return buffer;
};

interface PlayerInfo {
  name: string;
  playeruid: string;
  steamid: string;
}

function parsePlayerData(input: string): PlayerInfo[] {
  return input
    .split('\n')
    .slice(1)
    .filter((item) => item !== '')
    .map((item) => {
      const [name, playeruid, steamid] = item.split(',');
      return {
        name,
        playeruid,
        steamid,
      };
    });
}

// Функция для отправки информации о игроке в канал Discord
export const sendPlayerInfo = (input: string): EmbedBuilder[] => {
  const playerInfo = parsePlayerData(input);

  return playerInfo.map(({ name, playeruid, steamid }) => {
    return new EmbedBuilder()
      .setTitle('Информация об игроке') // Title of the embed
      .addFields(
        { name: 'Имя', value: name, inline: true },
        { name: 'Player UID', value: playeruid, inline: true },
        { name: 'Steam ID', value: steamid, inline: true },
      )
      .setColor('#0099ff');
  });
};
