import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RoomMember } from './room_members.entity';
import { nanoid } from 'nanoid';
@Entity()
export class Room {
  @PrimaryColumn({ length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(8);
  }
  @Column({ length: 30 })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @ManyToOne(() => User, { cascade: true, eager: false })
  @JoinColumn({ name: 'admin_id' })
  admin: User;
  @OneToMany(() => RoomMember, (roomMember) => roomMember.room)
  members: RoomMember[];
}
