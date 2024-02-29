import { CommandInteraction } from 'discord.js';
//
import { sendPlayerInfo } from '#helpers';
import { PalRCONClient } from '#config/rcon.ts';
import { ERRORS, SUCCESS_MESSAGES } from '#const';

const rcon = new PalRCONClient();

/**
 * Обработчик команды "ping" для интерактивной команды Discord.
 * Отвечает сообщением "Pong!".
 * @param {CommandInteraction} interaction - Объект взаимодействия команды Discord.
 */
export const pingHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  await interaction.reply('Pong!');
};

/**
 * Обработчик команды "players" для интерактивной команды Discord.
 * Получает информацию о текущих игроках с сервера RCON и отправляет её
 * в Discord в виде встраиваемых элементов (embeds).
 * Если игроки не найдены, отправляет соответствующее сообщение.
 * @param {CommandInteraction} interaction - Объект взаимодействия команды Discord.
 */
export const playersHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  try {
    const resp = await rcon.ShowPlayers();
    const embeds = sendPlayerInfo(resp);

    if (embeds.length) {
      await interaction.reply({ embeds });
    }

    if (!embeds.length) {
      await interaction.reply(SUCCESS_MESSAGES.NO_PLAYERS_FOUND);
    }
  } catch (error) {
    console.log(error);
    await interaction.reply(ERRORS.SHOW_PLAYERS_ERROR);
  }
};

/**
 * Обработчик команды "message" для интерактивной команды Discord.
 * Отправляет сообщение на RCON-сервер, чтобы транслировать его всем игрокам.
 * При успешной отправке сообщает об этом в Discord.
 * @param {CommandInteraction} interaction - Объект взаимодействия команды Discord.
 * @param {string} message - Сообщение для трансляции через RCON-сервер.
 */
export const messageHandler = async (
  interaction: CommandInteraction,
  message: string,
): Promise<void> => {
  try {
    await rcon.Broadcast(message);
    await interaction.reply(SUCCESS_MESSAGES.SEND_MESSAGE_SUCCESS);
  } catch (error) {
    await interaction.reply(ERRORS.SEND_MESSAGE_ERROR);
  }
};
