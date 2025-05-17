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

  @Column({ nullable: true })
  password: string; // We'll keep this for backward compatibility but won't use it

  @Column({ default: '' })
  phoneNumber: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: "citizen" })
  role: string;

  @Column({ nullable: true })
  auth0Id: string; // Store Auth0 user ID for reference

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
