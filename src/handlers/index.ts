import { CommandInteraction } from 'discord.js';
import { PalRCONClient } from '#config/rcon.ts';
import { ERRORS, SUCCESS_MESSAGES } from '#const';
import { sendPlayerInfo } from '../helpers/index.js';

const rcon = new PalRCONClient();

export const pingHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  await interaction.reply('Pong!');
};

export const playersHandler = async (
  interaction: CommandInteraction,
): Promise<void> => {
  try {
    const resp = await rcon.ShowPlayers();
    console.log(resp);
    const embeds = sendPlayerInfo(resp);
    await interaction.reply({ embeds });
  } catch (error) {
    console.log(error);
    await interaction.reply(ERRORS.SHOW_PLAYERS_ERROR);
  }
};

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
