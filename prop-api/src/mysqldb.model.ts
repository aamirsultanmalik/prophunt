import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  formatted_address: string;

  @Column()
  house_No: string;
}



export class PropertyModel {
    email: string;
    formatted_address: string;
    house_list:string[];
  }