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

  // Added AI-related fields
  @Column({ nullable: true })
  sentimentScore: number;

  @Column({ nullable: true })
  language: string;

  @ManyToOne(() => Category, { nullable: false })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => Agency, { nullable: true })
  agency: Agency;

  @Column({ nullable: true })
  agencyId: string;

  @ManyToOne(() => User, (user) => user.complaints, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
