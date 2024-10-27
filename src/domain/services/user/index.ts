import { ExistedUser, UpdateUser, UserCreate, User } from '@/domain/entities/user';
import { UserRepositoryError, UserServiceError } from '@/domain/errors/user';
import { Either, ErrorResult, Result } from '@/lib';

interface IUserRepository {
	save(user: UserCreate): Promise<Either<UserRepositoryError, ExistedUser>>
	findById(id: string): Promise<Either<UserRepositoryError, ExistedUser>>
	findByUsername(username: string): Promise<Either<UserRepositoryError, ExistedUser>>
	update(user: ExistedUser): Promise<Either<UserRepositoryError, ExistedUser>>
	delete(userId: string): Promise<Either<UserRepositoryError, void>>
}

interface IPasswordService {
	checkComplexity(password: string): boolean;
	generateHash(password: string): Promise<Either<void, string>>;
}

type FullFilledUser = Required<{
	[K in keyof UpdateUser]-?: NonNullable<UpdateUser[K]>
}>

export class UserService {
	constructor(private userRepository: IUserRepository, private passwordService: IPasswordService) { }

	async create({ username, password }: UserCreate): Promise<Either<UserServiceError, User>> {
		const resultFindByName = await this.userRepository.findByUsername(username);

		if (resultFindByName.isResult()) {
			return ErrorResult.create(UserServiceError.AlreadyExist)
		}

		if (resultFindByName.isError()) {
			const { error } = resultFindByName;

			if (error === UserRepositoryError.UnknownError) {
				return ErrorResult.create(UserServiceError.UnknownError);
			}
		}

		const resultPasswordHash = await this.getHashPassword(password);

		if (resultPasswordHash.isError()) {
			return ErrorResult.create(resultPasswordHash.error);
		}

		const resultSaveNewUser = await this.userRepository.save({ username, password: resultPasswordHash.value });

		return resultSaveNewUser.isError() ?
			ErrorResult.create(UserServiceError.PasswordTooSimple)
			: Result.create(resultSaveNewUser.value);
	}

	async findById(userId: string): Promise<Either<UserServiceError, User>> {
		const resultFindUserById = await this.userRepository.findById(userId);

		if (resultFindUserById.isError()) {
			const { error } = resultFindUserById;

			switch (error) {
				case UserRepositoryError.UnknownError: return ErrorResult.create(UserServiceError.UnknownError);
				case UserRepositoryError.NotFoundUser: return ErrorResult.create(UserServiceError.NotFoundUser);
				default: return ErrorResult.create(UserServiceError.UnknownError);
			}
		}

		return Result.create(resultFindUserById.value);
	}

	async findByUsername(username: string): Promise<Either<UserServiceError, User>> {
		const resultFindUserByUsername = await this.userRepository.findByUsername(username);

		if (resultFindUserByUsername.isError()) {
			const { error } = resultFindUserByUsername;

			switch (error) {
				case UserRepositoryError.UnknownError: return ErrorResult.create(UserServiceError.UnknownError);
				case UserRepositoryError.NotFoundUser: return ErrorResult.create(UserServiceError.NotFoundUser);
				default: return ErrorResult.create(UserServiceError.UnknownError);
			}
		}

		return Result.create(resultFindUserByUsername.value);
	}

	async update(updateUser: UpdateUser): Promise<Either<UserServiceError, User>> {
		let updatedAndSaveUserResult: Either<UserServiceError, User>;

		if (!updateUser.password || !updateUser.username) {
			updatedAndSaveUserResult = await this.updateNotFullFilled(updateUser);
		} else {
			updatedAndSaveUserResult = await this.updateFullFilled(updateUser);
		}

		return updatedAndSaveUserResult.isError() ?
			ErrorResult.create(updatedAndSaveUserResult.error)
			: Result.create(updatedAndSaveUserResult.value);
	}

	async delete(userId: string): Promise<Either<UserServiceError, User>> {
		const existUserResult = await this.findById(userId);

		if (existUserResult.isError()) {
			return ErrorResult.create(existUserResult.error);
		}

		const existUser = existUserResult.value;

		const resultDelete = await this.userRepository.delete(existUser.id);

		return resultDelete.isError() ?
			ErrorResult.create(UserServiceError.UnknownError)
			: Result.create(existUser);
	}

	private async updateNotFullFilled(updateUser: UpdateUser): Promise<Either<UserServiceError, User>> {
		const existUserResult = await this.findById(updateUser.id);

		if (existUserResult.isError()) {
			return ErrorResult.create(existUserResult.error);
		}

		const existUser = existUserResult.value;

		if (updateUser.password) {
			const resultPasswordHash = await this.getHashPassword(updateUser.password);

			if (resultPasswordHash.isError()) {
				return ErrorResult.create(resultPasswordHash.error);
			}

			existUser.password = resultPasswordHash.value;
		}

		if (updateUser.username) {
			existUser.username = updateUser.username
		}

		const updatedAndSaveUserResult = await this.update(updateUser);

		return updatedAndSaveUserResult.isError() ?
			ErrorResult.create(UserServiceError.UnknownError)
			: Result.create(updatedAndSaveUserResult.value);
	}

	private async updateFullFilled(updateUser: FullFilledUser): Promise<Either<UserServiceError, User>> {
		const resultPasswordHash = await this.getHashPassword(updateUser.password);

		if (resultPasswordHash.isError()) {
			return ErrorResult.create(resultPasswordHash.error);
		}

		updateUser.password = resultPasswordHash.value;

		const updatedAndSaveUserResult = await this.update(updateUser);

		return updatedAndSaveUserResult.isError() ?
			ErrorResult.create(UserServiceError.UnknownError)
			: Result.create(updatedAndSaveUserResult.value);
	}

	private async getHashPassword(password: string): Promise<Either<UserServiceError, string>> {
		const isPasswordTooSimple = this.passwordService.checkComplexity(password);

		if (isPasswordTooSimple) {
			return ErrorResult.create(UserServiceError.PasswordTooSimple);
		}

		const resultPasswordHash = await this.passwordService.generateHash(password);

		return resultPasswordHash.isError() ?
			ErrorResult.create(UserServiceError.UnknownError)
			: Result.create(resultPasswordHash.value);
	}
}