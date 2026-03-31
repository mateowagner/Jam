import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room_members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomMember]), UsersModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [TypeOrmModule, RoomsService],
})
export class RoomsModule {}
