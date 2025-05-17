import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complaint } from "./Complaint";

@Entity()
export class Agency {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column()
    name: string;

  @Column()
  contactEmail: string;

  @Column()
  description: string;

  @OneToMany(() => Complaint, (complaint) => complaint.agency)
  complaints: Complaint[];
}