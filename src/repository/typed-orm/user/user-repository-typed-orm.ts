import { EntityManager } from 'typeorm';
import { UserEntity } from '../../../domain/entities/user';
import { IUserRepository } from '../../user/interface-user-repository';
import { UserDTO } from './dto';
import "reflect-metadata"

export class UserRepository implements IUserRepository {

	constructor(private entityManager: EntityManager){}

	async create(userEntity: UserEntity): Promise<UserEntity> {
		const userDto = new UserDTO();

		userDto.username = userEntity.username;
		userDto.password = userEntity.password;

		const returnUserDto = await this.entityManager.save(userDto);

		return new UserEntity(
			returnUserDto.id, 
			returnUserDto.username, 
			returnUserDto.password, 
			returnUserDto.createdAt, 
			returnUserDto.updatedAt, 
			returnUserDto.deleteAt
		);		
	}

	findById(id: string): Promise<UserEntity> {
		throw new Error('Method not implemented.');
	}

	findByUsername(username: string): Promise<UserEntity> {
		throw new Error('Method not implemented.');
	}

	update(userEntity: UserEntity): Promise<UserEntity> {
		throw new Error('Method not implemented.');
	}

	delete(userId: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
}