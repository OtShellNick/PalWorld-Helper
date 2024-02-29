import { CommandInteraction } from 'discord.js';
//
import { sendPlayerInfo } from '#helpers';
import { PalRCONClient } from '#config/rcon.ts';
import { ERRORS, SUCCESS_MESSAGES } from '#const';

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
