import { EntityManager, Repository } from 'typeorm';
import { User } from './model';
import { ExistedUser, UserCreate, User as UserEntity } from '@/domain/entities/user';
import { Either, ErrorResult, Result } from '@/lib';
import {
	UserRepositorySaveError,
	UserRepositoryFindError,
	UserRepositoryUpdateError,
	UserRepositoryDeleteError,
	UserRepositoryError
} from '@/domain/errors/user';

export class UserRepository {

	private repository: Repository<User>;

	constructor(entityManager: EntityManager) {
		this.repository = entityManager.getRepository(User);
	}

	async save(user: UserCreate): Promise<Either<UserRepositorySaveError, ExistedUser>> {
		try {
			const userResult = await this.repository.save(user);
			return Result.create(userResult);
		} catch {
			return ErrorResult.create(UserRepositoryError.UnknownError);
		}
	}

	async findById(id: string): Promise<Either<UserRepositoryFindError, ExistedUser>> {
		try {
			const userResult = await this.repository.findOneBy({ id });

			if (!userResult) {
				return ErrorResult.create(UserRepositoryError.NotFoundUser);
			}

			return Result.create(userResult);
		} catch {
			return ErrorResult.create(UserRepositoryError.UnknownError);
		}
	}

	async findByUsername(username: string): Promise<Either<UserRepositoryFindError, ExistedUser>> {
		try {
			const userResult = await this.repository.findOneBy({ username });

			if (!userResult) {
				return ErrorResult.create(UserRepositoryError.NotFoundUser);
			}

			return Result.create(userResult);
		} catch {
			return ErrorResult.create(UserRepositoryError.UnknownError);
		}
	}

	async update(userEntity: UserEntity): Promise<Either<UserRepositoryUpdateError, ExistedUser>> {
		try {
			const userResult = await this.repository.save(userEntity);

			return Result.create(userResult);
		} catch {
			return ErrorResult.create(UserRepositoryError.UnknownError);
		}
	}

	async delete(userId: string): Promise<Either<UserRepositoryDeleteError, void>> {
		try {
			await this.repository.delete({ id: userId });

			return Result.create(undefined);
		} catch {
			return ErrorResult.create(UserRepositoryError.UnknownError);
		}
	}
}