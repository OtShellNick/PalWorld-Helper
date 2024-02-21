import { TCommandItem } from '#types';

export const COMMANDS: TCommandItem[] = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'players',
    description: 'Показывает количество игроков на сервере',
  },
  {
    name: 'save',
    description: 'Сохраняет мир',
  },
  {
    name: 'send',
    description: 'Отправляет сообщение',
  },
  {
    name: 'ban',
    description: 'Забанить игрока',
  },
  {
    name: 'kick',
    description: 'Выкинуть игрока',
  },
  {
    name: 'shutdown',
    description: 'Выключает сервер',
  },
  {
    name: 'message',
    description: 'Отправляет сообщение',
  },
];

export enum ERRORS {
  SHOW_PLAYERS_ERROR = 'Ошибка при показе игроков',
  SEND_MESSAGE_ERROR = 'Ошибка при отправке сообщения',
}

export enum SUCCESS_MESSAGES {
  SEND_MESSAGE_SUCCESS = 'Сообщение успешно отправлено',
}

export enum COMMANDS_NAMES {
  PING = 'ping',
  PLAYERS = 'players',
  MESSAGE = 'message',
}
