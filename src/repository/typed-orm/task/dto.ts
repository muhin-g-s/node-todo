import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from '../user/dto';

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn()
  userId: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	isCompleted: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deleteAt: Date;
}