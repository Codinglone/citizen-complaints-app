import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Complaint, (complaint) => complaint.category)
  complaints: Complaint[];
}
