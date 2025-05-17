import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: "citizen" })
  role: string;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
