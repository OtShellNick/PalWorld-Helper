import { Buffer } from 'node:buffer';
import { TPlayerInfo } from '#types';
import { EmbedBuilder } from 'discord.js';

/**
 * Выводит в консоль сообщение.
 * @param {any} args - Аргументы для вывода в лог.
 */
export const log = console.log;

/**
 * Выводит в консоль сообщение об ошибке.
 * @param {any} args - Аргументы для вывода ошибки.
 */
export const error = console.error;

/**
 * Создает буфер данных на основе строки, идентификатора и идентификатора запроса.
 * @param {string} data - Строка, которую нужно поместить в буфер.
 * @param {number} id - Идентификатор, который будет использоваться в буфере.
 * @param {number} requestId - Идентификатор запроса для использования в буфере.
 * @returns {Buffer} - Буфер, содержащий данные, идентификаторы и строку.
 */
export const bufferController = (
  data: string,
  id: number,
  requestId: number,
): Buffer => {
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

/**
 * Разбирает строку с данными игроков и возвращает массив объектов информации об игроках.
 * @param {string} input - Строка с данными игроков, разделенных запятыми и новыми строками.
 * @returns {TPlayerInfo[]} - Массив объектов с информацией об игроках.
 */
function parsePlayerData(input: string): TPlayerInfo[] {
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

/**
 * Создает массив встраиваемых элементов (EmbedBuilder) с информацией об игроках для Discord.
 * @param {string} input - Строка с данными игроков для парсинга и создания встраиваемых элементов.
 * @returns {EmbedBuilder[]} - Массив встраиваемых элементов с информацией об игроках.
 */
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
