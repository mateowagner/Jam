import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
@Entity()
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  video_id: string;
  @Column()
  thumbnail: string;
  @Column({ default: false })
  played: boolean;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  added_at: Date;
  @ManyToOne(() => Room, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  @Index()
  room: Room;
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'added_by_id' })
  added_by: User;
}
