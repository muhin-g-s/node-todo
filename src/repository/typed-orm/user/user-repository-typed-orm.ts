import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '@/domain/entities/user';
import { User } from './dto';
import { IUserRepository } from '@/repository/user';

export class UserRepository implements IUserRepository {

	private repository: Repository<User>;

	constructor(private entityManager: EntityManager){
		this.repository = entityManager.getRepository(User);
	}

	async create(userEntity: UserEntity): Promise<UserEntity> {
		const userDto = new User();

		userDto.username = userEntity.username;
		userDto.password = userEntity.password;

		const returnUserDto = await this.repository.save(userDto);

		return new UserEntity(
			returnUserDto.id, 
			returnUserDto.username, 
			returnUserDto.password, 
			returnUserDto.createdAt, 
			returnUserDto.updatedAt, 
			returnUserDto.deleteAt
		);		
	}

	async findById(id: string): Promise<UserEntity> {
		return this.repository.findOneBy({id});
	}

	findByUsername(username: string): Promise<UserEntity> {
		return this.repository.findOneBy({username});
	}

	update(userEntity: UserEntity): Promise<UserEntity> {
		return this.repository.save({...userEntity, id: userEntity.id});
	}

	async delete(userId: string): Promise<void> {
		await this.repository.delete({id: userId});
	}
}