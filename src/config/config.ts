import { log, error } from '#helpers';
import { REST, Routes } from 'discord.js';
import { COMMANDS } from '#const/index.ts';

export const initConfig = async (token: string, clientId: string) => {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), {
      body: COMMANDS,
    });

    log('Successfully reloaded application (/) commands.');
  } catch (errorData) {
    error(errorData);
  }
};
