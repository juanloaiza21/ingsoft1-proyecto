import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3003, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Notify all clients about new connection
    this.server.emit('userConnected', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Notify all clients about disconnection
    this.server.emit('userDisconnected', { id: client.id });
  }

  @SubscribeMessage('newMessage')
  handleMessage(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('messageCharged', {
      wsId: client.id,
      idFrom: parseInt(data[1]),
      idTo: parseInt(data[2]),
      message: data[0],
      date: new Date(),
    });
  }
}
