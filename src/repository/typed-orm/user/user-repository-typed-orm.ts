import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '@/domain/entities/user';
import { User } from './dto';

export class UserRepository {

	private repository: Repository<User>;

	constructor(private entityManager: EntityManager){
		this.repository = entityManager.getRepository(User);
	}

	create(userEntity: UserEntity): Promise<UserEntity> {
		return this.repository.save(this.mapUserEntity(userEntity));
	}

	findById(id: string): Promise<UserEntity | null> {
		return this.repository.findOneBy({id});
	}

	findByUsername(username: string): Promise<UserEntity | null> {
		return this.repository.findOneBy({username});
	}

	update(userEntity: UserEntity): Promise<UserEntity> {
		return this.repository.save(this.mapUserEntity(userEntity));
	}

	async delete(userId: string): Promise<void> {
		await this.repository.delete({id: userId});
	}

	private mapUserEntity(userEntity: UserEntity): User {

		const userDto = new User();

		if(userEntity.id) {
			userDto.id = userEntity.id
		}

		userDto.password = userEntity.password;
		userDto.username = userEntity.username;
		
		return userDto;
	}
}