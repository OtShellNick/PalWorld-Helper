import { Client, GatewayIntentBits } from 'discord.js';
import { log } from '#helpers';
import { PalRCONClient } from '#config/rcon.ts';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rcon = new PalRCONClient();

export const initClient = async (token: string) => {
  client.on('ready', () => {
    log(`Logged in as ${client?.user?.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'test') {
      await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'players') {
      try {
        const resp = await rcon.ShowPlayers();
        await interaction.reply(resp);
      } catch (error) {
        log(error);
      }
    }

    if (interaction.commandName === 'message') {
      try {
        await rcon.Broadcast('test messge');
        await interaction.reply('Сообщение успешно отправлено');
      } catch (error) {
        await interaction.reply('При отправке сообщение произошла ошибка');
      }
    }
  });

  await client.login(token);
};
