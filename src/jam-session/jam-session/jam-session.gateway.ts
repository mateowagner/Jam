import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SongsService } from 'src/songs/songs.service';
import { Logger } from '@nestjs/common';
@WebSocketGateway({ cors: { origin: '*' } })
export class JamSessionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly songsService: SongsService) {}
  private clientRooms = new Map<string, { roomId: string; username: string }>();
  private readonly logger = new Logger(JamSessionGateway.name);
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const clientData = this.clientRooms.get(client.id);
    if (clientData) {
      this.server
        .to(clientData.roomId)
        .emit('userLeft', { username: clientData.username });
      this.clientRooms.delete(client.id);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    client: Socket,
    payload: { roomId: string; username: string },
  ) {
    void client.join(payload.roomId);
    this.clientRooms.set(client.id, {
      roomId: payload.roomId,
      username: payload.username,
    });

    // obtener todos los usuarios en la sala
    const usersInRoom = Array.from(this.clientRooms.values())
      .filter((u) => u.roomId === payload.roomId)
      .map((u) => ({ username: u.username }));

    // mandar la lista completa solo al cliente que se unió
    client.emit('roomParticipants', usersInRoom);

    // notificar a los demás que alguien entró
    client
      .to(payload.roomId)
      .emit('userJoined', { username: payload.username });
  }
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    client: Socket,
    payload: { roomId: string; username: string },
  ) {
    // unir al cliente al room de socket.io
    void client.leave(payload.roomId);

    // notificar a todos en la sala que alguien salió
    this.server.to(payload.roomId).emit('userLeft', {
      username: payload.username,
    });

    this.logger.log(`${payload.username} left room ${payload.roomId}`);
  }
  @SubscribeMessage('addSong')
  async handleAddSong(
    client: Socket,
    payload: {
      roomId: string;
      title: string;
      video_id: string;
      thumbnail: string;
      added_by_id: string;
    },
  ) {
    // agregar la canción a la lista de canciones en la sala
    const song = await this.songsService.create({
      room_id: payload.roomId,
      title: payload.title,
      video_id: payload.video_id,
      thumbnail: payload.thumbnail,
      added_by_id: payload.added_by_id,
    });

    // notificar a todos en la sala que se agregó una nueva canción
    this.server.to(payload.roomId).emit('queueUpdated', {
      song,
    });

    this.logger.log(`Song added to room ${payload.roomId}: ${payload.title}`);
  }
  @SubscribeMessage('playSong')
  handlePlaySong(client: Socket, payload: { roomId: string; songId: string }) {
    // reproducir la canción en la sala
    this.server.to(payload.roomId).emit('songPlaying', {
      songId: payload.songId,
    });

    this.logger.log(
      `Song playing in room ${payload.roomId}: ${payload.songId}`,
    );
  }
  @SubscribeMessage('skipSong')
  async handleSkipSong(
    client: Socket,
    payload: { roomId: string; songId: string },
  ) {
    await this.songsService.markAsPlayed(payload.songId);
    this.server
      .to(payload.roomId)
      .emit('queueUpdated', { skippedSongId: payload.songId });
  }
  @SubscribeMessage('pauseSong')
  handlePauseSong(client: Socket, payload: { roomId: string }) {
    this.server.to(payload.roomId).emit('songPaused');
    this.logger.log(`Song paused in room ${payload.roomId}`);
  }
}
