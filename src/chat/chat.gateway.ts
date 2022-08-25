import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

export const rooms = [];
const prevMessages = {};
@WebSocketGateway({ cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: Socket,
    message: {
      sender: string;
      room: string;
      message: string;
      date: string | undefined;
    },
  ) {
    const date = new Date(Date.now()).toLocaleString('en-UK', {
      hour: 'numeric',
      minute: 'numeric',
    });
    message.date = date;
    if (!prevMessages[message.room]) {
      prevMessages[message.room] = [];
      prevMessages[message.room].push({
        message: message.message,
        sender: message.sender,
        date: message.date,
      });
    } else {
      prevMessages[message.room].push({
        message: message.message,
        sender: message.sender,
        date: message.date,
      });
    }
    this.wss.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }
  @SubscribeMessage('createNewRoom')
  handleRoomCreate(client: Socket, room: string) {
    rooms.push(room);
    this.wss.emit('newChat', room);
  }
  @SubscribeMessage('sendMessages')
  handleMessagesSend(client: Socket) {
    client.emit('receiveMessages', prevMessages);
  }
}
