import net from 'net';
import { randomInt } from 'crypto';
import { Buffer } from 'node:buffer';
import { TBaseRecord } from '#types';
import { configDotenv } from 'dotenv';
import { bufferController } from '#helpers';

configDotenv();

const { RCON_HOST, RCON_PORT, ADMIN_PASSWORD } = process.env as TBaseRecord;

interface RCONClientOptions {
  host: string;
  port: number;
  password: string;
}

class PalRCONClient {
  private options: RCONClientOptions;
  private connected: boolean;
  private authed: boolean;
  private socket: net.Socket;
  private id: number;

  constructor() {
    this.options = {
      host: RCON_HOST,
      port: Number(RCON_PORT),
      password: ADMIN_PASSWORD,
    };
    this.connected = false;
    this.authed = false;
    this.socket = new net.Socket();
    this.id = randomInt(2147483647);
  }

  private async connect() {
    console.log('Connecting...');
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(this.options.port, this.options.host);
      this.socket.once('error', () => reject(new Error('Connection error')));
      this.socket.once('connect', () => {
        console.log('Connected!');
        this.connected = true;
        this.id = randomInt(2147483647);
        this.sendRawCommand(this.options.password, 3)
          .then((response) => {
            if (Buffer.isBuffer(response) && response.length >= 4) {
              const receivedId = response.readUInt32LE(4);
              if (receivedId === this.id) {
                this.authed = true;
                console.log('Authenticated!');
                resolve(null);
              } else {
                this.disconnect();
                reject(new Error('Authentication error'));
              }
            } else {
              this.disconnect();
              reject(new Error('Invalid response format'));
            }
          })
          .catch((error) => reject(error));
      });

      // this.socket.on('data', (data) => {
      // Handle incoming data if needed
      // });
    });
  }

  async sendRawCommand(data: string, requestId: number): Promise<Buffer> {
    if (!this.connected) {
      throw new Error(
        `Authentication Error: ${this.options.host}:${this.options.port}`,
      );
    }

    const buffer = bufferController(data, this.id, requestId);

    return new Promise((resolve, reject) => {
      let responseData = Buffer.alloc(0);

      const onData = (dataChunk: Uint8Array) => {
        // Сконкатенировать полученные данные
        responseData = Buffer.concat([responseData, Buffer.from(dataChunk)]);

        // Проверить, достаточно ли данных для чтения предполагаемой длины ответа
        if (responseData.length < 4) {
          // Недостаточно данных для определения длины ответа
          return;
        }

        // Читаем длину ответа из первых 4 байтов responseData
        const responseLength = responseData.readUInt32LE(0);

        console.log(
          'Response length:',
          responseLength,
          'Response Data Length:',
          responseData.length,
        );
        // Проверить, получен ли полный ответ
        if (responseData.length >= responseLength + 4) {
          // Полный ответ получен, убрать слушатели и разрешить промис
          this.socket.removeListener('data', onData);
          this.socket.removeListener('error', onError);

          // Получить полный ответ, не включая 4 байта длины
          const fullResponse = responseData.slice(4, responseLength + 4);
          resolve(responseData);
        }
      };
      const onError = (error: Error) => {
        this.socket.removeListener('data', onData);
        reject(error);
      };

      this.socket.write(buffer);
      this.socket.on('data', onData);

      this.socket.once('error', onError);
    });
  }

  async Send(command: string): Promise<string> {
    try {
      await this.connect();
      const response = await this.sendRawCommand(command, 2);
      return response
        .subarray(12)
        .toString('utf-8')
        .replace(/\x00|\u0000/g, '');
    } catch (e) {
      const error = e as Error;
      throw new Error(
        ` Instance ${this.options.host}:${this.options.port}: ${error.message}`,
      );
    } finally {
      this.disconnect();
    }
  }

  async ShowPlayers() {
    try {
      await this.connect();
      const response = await this.sendRawCommand('ShowPlayers', 2);
      console.log(
        response
          .subarray(12)
          .toString('utf-8')
          .replace(/\x00|\u0000/g, ''),
      );
      return response
        .subarray(12)
        .toString('utf-8')
        .replace(/\x00|\u0000/g, '');
    } catch (e) {
      const error = e as Error;
      throw new Error(
        `Error for client at ${this.options.host}:${this.options.port}: ${error.message}`,
      );
    } finally {
      this.disconnect();
    }
  }

  async Broadcast(message: string) {
    try {
      await this.connect();
      const editedMessage = message.replace(/ /g, '_');
      const response = await this.sendRawCommand(
        `Broadcast ${editedMessage}`,
        2,
      );
      return response
        .subarray(12)
        .toString('utf-8')
        .replace(/\x00|\u0000/g, '');
    } catch (e) {
      const error = e as Error;
      throw new Error(
        `Error for client at ${this.options.host}:${this.options.port}: ${error.message}`,
      );
    } finally {
      this.disconnect();
    }
  }

  // static async Save(this: PalRCONClient) {
  //   try {
  //     await this.connect();
  //     const response = await this.sendRawCommand('Save', 2);
  //     return response
  //       .subarray(12)
  //       .toString('utf-8')
  //       .replace(/\x00|\u0000/g, '');
  //   } catch (error) {
  //     throw new Error(
  //       // @ts-ignore
  //       `Error for client at ${this.options.host}:${this.options.port}: ${error.message}`,
  //     );
  //   } finally {
  //     this.disconnect();
  //   }
  // }

  // static async ShutDown(
  //   this: PalRCONClient,
  //   time: string,
  //   message: string,
  // ) {
  //   try {
  //     await this.connect();
  //     const editedMessage = message.replace(/ /g, '_');
  //     if (!/^\d+$/.test(time)) {
  //       throw new Error('Invalid time format. Time must contain only numbers.');
  //     }
  //     const response = await this.sendRawCommand(
  //       `ShutDown ${time} ${editedMessage}`,
  //       2,
  //     );
  //     return response
  //       .subarray(12)
  //       .toString('utf-8')
  //       .replace(/\x00|\u0000/g, '');
  //   } catch (error) {
  //     throw new Error(
  //       `Error for client at ${this.options.host}:${this.options.port}: ${error.message}`,
  //     );
  //   } finally {
  //     this.disconnect();
  //   }
  // }

  // static async Kick(this: PalRCONClient, steamId: string) {
  //   try {
  //     await this.connect();
  //     if (!/^\d+$/.test(steamId)) {
  //       throw new Error('Invalid steamId. steamId must contain only numbers.');
  //     }
  //     const response = await this.sendRawCommand(
  //       `KickPlayer ${steamId}`,
  //       2,
  //     );
  //     return response
  //       .subarray(12)
  //       .toString('utf-8')
  //       .replace(/\x00|\u0000/g, '');
  //   } catch (error) {
  //     throw new Error(
  //       // @ts-ignore
  //       `Error for client at ${this.options.host}:${this.options.port}: ${error.message}`,
  //     );
  //   } finally {
  //     this.disconnect();
  //   }
  // }

  // static async Ban(this: PalRCONClient, steamId: string) {
  //   try {
  //     await this.connect();
  //     if (!/^\d+$/.test(steamId)) {
  //       throw new Error('Invalid steamId. steamId must contain only numbers.');
  //     }
  //     const response = await this.sendRawCommand(
  //       `BanPlayer ${steamId}`,
  //       2,
  //     );
  //     return response
  //       .subarray(12)
  //       .toString('utf-8')
  //       .replace(/\x00|\u0000/g, '');
  //   } catch (error) {
  //     throw new Error(
  //       // @ts-ignore
  //       `Error for client at ${this.options.host}:${this.options.port}: ${error.message}`,
  //     );
  //   } finally {
  //     this.disconnect();
  //   }
  // }

  async checkConnection() {
    try {
      await this.connect();
      return true;
    } catch (error) {
      return false;
    } finally {
      this.disconnect();
    }
  }

  disconnect() {
    console.log('Disconnecting...');
    this.connected = false;
    this.authed = false;
    this.socket.end();
  }
}
export { PalRCONClient };
