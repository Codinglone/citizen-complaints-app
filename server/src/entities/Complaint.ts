import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Agency } from "./Agency";
import { Category } from "./Category";

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  sentimentScore: number;

  @Column({ nullable: true })
  language: string;

  @Column({ default: "pending" })
  status: string;

  @Column({ default: "medium" })
  priority: string;

  @Column({ nullable: true })
  trackingCode: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @ManyToOne(() => User, (user) => user.complaints, { nullable: true })
  user: User;

  @ManyToOne(() => Agency, (agency) => agency.complaints, { nullable: true })
  agency: Agency;

  @ManyToOne(() => Category, (category) => category.complaints)
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
