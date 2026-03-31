import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository.js';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Song } from './entities/song.entity';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception.js';
@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}
  async create(createSongDto: CreateSongDto) {
    const room = await this.roomsRepository.findOneBy({
      id: createSongDto.room_id,
    });
    if (!room) {
      throw new NotFoundException(
        `Room with id ${createSongDto.room_id} not found`,
      );
    }
    const admin = await this.usersRepository.findOneBy({
      id: createSongDto.added_by_id,
    });
    if (!admin)
      throw new NotFoundException(
        `User with id ${createSongDto.added_by_id} not found`,
      );
    const song = this.songsRepository.create({
      ...createSongDto,
      room,
      added_by: admin,
    });
    return await this.songsRepository.save(song);
  }

  async findByRoom(roomId: string) {
    return await this.songsRepository.find({
      where: { room: { id: roomId }, played: false },
      order: { added_at: 'ASC' },
    });
  }

  async findAll() {
    return await this.songsRepository.find();
  }
  async markAsPlayed(id: string) {
    const song = await this.songsRepository.findOneBy({ id: id });
    if (!song) {
      throw new Error(`User with id ${id} not found`);
    }
    song.played = true;
    return await this.songsRepository.save(song);
  }
  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return updateSongDto;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
