import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Room } from './rooms/entities/room.entity';
import { ConfigModule } from '@nestjs/config';
import { RoomMember } from './rooms/entities/room_members.entity';
import { Song } from './songs/entities/song.entity';
import { JamSessionModule } from './jam-session/jam-session.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Room, RoomMember, Song],
      synchronize: true,
    }),
    RoomsModule,
    UsersModule,
    SongsModule,
    AuthModule,
    JamSessionModule,
    YoutubeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
