import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Song]), UsersModule, RoomsModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [TypeOrmModule, SongsService],
})
export class SongsModule {}
