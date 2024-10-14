import "reflect-metadata"

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserDTO {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	createdAt: Date;

	@Column()
	updatedAt: Date;

	@Column()
	deleteAt: Date;
}