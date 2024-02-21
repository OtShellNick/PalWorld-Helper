import { log } from '#helpers';
import { COMMANDS_NAMES } from '#const';
import { Client, GatewayIntentBits } from 'discord.js';
import { messageHandler, pingHandler, playersHandler } from '#handlers';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const initClient = async (token: string) => {
  client.on('ready', () => {
    log(`Logged in as ${client?.user?.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
      case COMMANDS_NAMES.PING:
        await pingHandler(interaction);
        break;
      case COMMANDS_NAMES.PLAYERS:
        await playersHandler(interaction);
        break;
      case COMMANDS_NAMES.MESSAGE:
        await messageHandler(interaction, 'message');
        break;
      default:
        break;
    }
  });

  await client.login(token);
};
