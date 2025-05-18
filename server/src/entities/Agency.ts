import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class Agency {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "simple-array", nullable: true })
  categories: string[];

  @Column({ type: "simple-array", nullable: true })
  jurisdictions: string[];

  @OneToMany(() => Complaint, (complaint) => complaint.agency)
  complaints: Complaint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}