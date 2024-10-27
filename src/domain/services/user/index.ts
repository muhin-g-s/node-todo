import { ExistedUser, UpdateUser, UserCreate, User } from '@/domain/entities/user';
import { Either, ErrorResult, Result } from '@/lib';

const enum RepositoryError {
	UnknownError,
	NotFoundUser,
}

const enum ServiceError {
	UnknownError,
	NotFoundUser,
	AlreadyExist,
	PasswordTooSimple,
}

interface IUserRepository {
	save(user: UserCreate): Promise<Either<RepositoryError, ExistedUser>>
	findById(id: string): Promise<Either<RepositoryError, ExistedUser>>
	findByUsername(username: string): Promise<Either<RepositoryError, ExistedUser>>
	update(user: ExistedUser): Promise<Either<RepositoryError, ExistedUser>>
	delete(userId: string): Promise<Either<RepositoryError, void>>
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

	async create({ username, password }: UserCreate): Promise<Either<ServiceError, User>> {
		const resultFindByName = await this.userRepository.findByUsername(username);

		if (resultFindByName.isResult()) {
			return ErrorResult.create(ServiceError.AlreadyExist)
		}

		if (resultFindByName.isError()) {
			const { error } = resultFindByName;

			if (error === RepositoryError.UnknownError) {
				return ErrorResult.create(ServiceError.UnknownError);
			}
		}

		const resultPasswordHash = await this.getHashPassword(password);

		if (resultPasswordHash.isError()) {
			return ErrorResult.create(resultPasswordHash.error);
		}

		const resultSaveNewUser = await this.userRepository.save({ username, password: resultPasswordHash.value });

		return resultSaveNewUser.isError() ?
			ErrorResult.create(ServiceError.PasswordTooSimple)
			: Result.create(resultSaveNewUser.value);
	}

	async findById(userId: string): Promise<Either<ServiceError, User>> {
		const resultFindUserById = await this.userRepository.findById(userId);

		if (resultFindUserById.isError()) {
			const { error } = resultFindUserById;

			switch (error) {
				case RepositoryError.UnknownError: return ErrorResult.create(ServiceError.UnknownError);
				case RepositoryError.NotFoundUser: return ErrorResult.create(ServiceError.NotFoundUser);
				default: return ErrorResult.create(ServiceError.UnknownError);
			}
		}

		return Result.create(resultFindUserById.value);
	}

	async findByUsername(username: string): Promise<Either<ServiceError, User>> {
		const resultFindUserByUsername = await this.userRepository.findByUsername(username);

		if (resultFindUserByUsername.isError()) {
			const { error } = resultFindUserByUsername;

			switch (error) {
				case RepositoryError.UnknownError: return ErrorResult.create(ServiceError.UnknownError);
				case RepositoryError.NotFoundUser: return ErrorResult.create(ServiceError.NotFoundUser);
				default: return ErrorResult.create(ServiceError.UnknownError);
			}
		}

		return Result.create(resultFindUserByUsername.value);
	}

	async update(updateUser: UpdateUser): Promise<Either<ServiceError, User>> {
		let updatedAndSaveUserResult: Either<ServiceError, User>;

		if (!updateUser.password || !updateUser.username) {
			updatedAndSaveUserResult = await this.updateNotFullFilled(updateUser);
		} else {
			updatedAndSaveUserResult = await this.updateFullFilled(updateUser);
		}

		return updatedAndSaveUserResult.isError() ?
			ErrorResult.create(updatedAndSaveUserResult.error)
			: Result.create(updatedAndSaveUserResult.value);
	}

	async delete(userId: string): Promise<Either<ServiceError, User>> {
		const existUserResult = await this.findById(userId);

		if (existUserResult.isError()) {
			return ErrorResult.create(existUserResult.error);
		}

		const existUser = existUserResult.value;

		const resultDelete = await this.userRepository.delete(existUser.id);

		return resultDelete.isError() ?
			ErrorResult.create(ServiceError.UnknownError)
			: Result.create(existUser);
	}

	private async updateNotFullFilled(updateUser: UpdateUser): Promise<Either<ServiceError, User>> {
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
			ErrorResult.create(ServiceError.UnknownError)
			: Result.create(updatedAndSaveUserResult.value);
	}

	private async updateFullFilled(updateUser: FullFilledUser): Promise<Either<ServiceError, User>> {
		const resultPasswordHash = await this.getHashPassword(updateUser.password);

		if (resultPasswordHash.isError()) {
			return ErrorResult.create(resultPasswordHash.error);
		}

		updateUser.password = resultPasswordHash.value;

		const updatedAndSaveUserResult = await this.update(updateUser);

		return updatedAndSaveUserResult.isError() ?
			ErrorResult.create(ServiceError.UnknownError)
			: Result.create(updatedAndSaveUserResult.value);
	}

	private async getHashPassword(password: string): Promise<Either<ServiceError, string>> {
		const isPasswordTooSimple = this.passwordService.checkComplexity(password);

		if (isPasswordTooSimple) {
			return ErrorResult.create(ServiceError.PasswordTooSimple);
		}

		const resultPasswordHash = await this.passwordService.generateHash(password);

		return resultPasswordHash.isError() ?
			ErrorResult.create(ServiceError.UnknownError)
			: Result.create(resultPasswordHash.value);
	}
}