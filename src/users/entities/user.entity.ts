import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoomMember } from 'src/rooms/entities/room_members.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 30, unique: true })
  email: string;
  @Column({ length: 30, unique: true })
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @OneToMany(() => RoomMember, (roomMember) => roomMember.user)
  rooms: RoomMember[];
}
