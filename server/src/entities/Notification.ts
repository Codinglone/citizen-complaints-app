import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column({ default: false })
  sent: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
