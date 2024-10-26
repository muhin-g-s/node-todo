import { EntityManager, Repository } from 'typeorm';
import { User } from './model';
import { UserCreate, User as UserEntity } from '@/domain/entities/user';

export class UserRepository {

	private repository: Repository<User>;

	constructor(entityManager: EntityManager) {
		this.repository = entityManager.getRepository(User);
	}

	save(user: UserCreate): Promise<UserEntity> {
		return this.repository.save(user);
	}

	async findById(id: string): Promise<UserEntity> {
		const user = await this.repository.findOneBy({ id });

		if (!user) {
			throw new Error('error');
		}

		return user;
	}

	async findByUsername(username: string): Promise<UserEntity> {
		const user = await this.repository.findOneBy({ username });

		if (!user) {
			throw new Error('error');
		}

		return user;
	}

	update(userEntity: UserEntity): Promise<UserEntity> {
		return this.repository.save(userEntity);
	}

	async delete(userId: string): Promise<void> {
		await this.repository.delete({ id: userId });
	}
}