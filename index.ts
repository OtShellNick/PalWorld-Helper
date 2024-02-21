import { TBaseRecord } from '#types';
import { configDotenv } from 'dotenv';
import { initConfig } from '#config/config.ts';
import { initClient } from '#config/client.ts';
configDotenv();

const { TOKEN, CLIENT_ID } = process.env as TBaseRecord;

await initConfig(TOKEN, CLIENT_ID);
await initClient(TOKEN);
