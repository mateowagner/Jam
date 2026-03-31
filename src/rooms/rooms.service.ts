import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository.js';
import { RoomMember } from './entities/room_members.entity';
@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RoomMember)
    private roomMembersRepository: Repository<RoomMember>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const admin = await this.usersRepository.findOneBy({
      id: createRoomDto.admin_id,
    });
    if (!admin)
      throw new NotFoundException(
        `Admin with id ${createRoomDto.admin_id} not found`,
      );
    let room = this.roomsRepository.create({ ...createRoomDto, admin });
    room = await this.roomsRepository.save(room);
    await this.addMember(room.id, admin.id, true);
    return room;
  }

  async findAll() {
    return await this.roomsRepository.find({ relations: ['admin'] });
  }

  async findOne(id: string) {
    return await this.roomsRepository.findOne({
      where: { id },
      relations: ['admin'],
    });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    Object.assign(room, updateRoomDto);
    return await this.roomsRepository.save(room);
  }

  async remove(id: string) {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return await this.roomsRepository.remove(room);
  }

  async addMember(roomId: string, userId: string, canPlay: boolean) {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const member = this.roomMembersRepository.create({
      room,
      user,
      can_play: canPlay,
    });
    return await this.roomMembersRepository.save(member);
  }
}
