import { UpdateUser, User } from '@/domain/entities/user';
import { UserServiceError, UserUseCaseError } from '@/domain/errors/user';
import { Either, ErrorResult, Result } from '@/lib';

interface IUserService {
	findById(userId: string): Promise<Either<UserServiceError, User>>;
	update(updateUser: UpdateUser): Promise<Either<UserServiceError, User>>;
	delete(userId: string): Promise<Either<UserServiceError, User>>;
}

export class UseCaseUser {
	constructor(private userService: IUserService) { }

	async getUser(userId: string): Promise<Either<UserUseCaseError, User>> {
		const userResult = await this.userService.findById(userId);

		if (userResult.isError()) {
			const { error } = userResult;

			switch (error) {
				case UserServiceError.UnknownError: return ErrorResult.create(UserUseCaseError.UnknownError);
				case UserServiceError.NotFoundUser: return ErrorResult.create(UserUseCaseError.NotFoundUser);
				default: return ErrorResult.create(UserUseCaseError.UnknownError);
			}
		}

		return Result.create(userResult.value);
	}

	async updateUser(user: UpdateUser): Promise<Either<UserUseCaseError, User>> {
		const userResult = await this.userService.update(user);

		if (userResult.isError()) {
			const { error } = userResult;

			switch (error) {
				case UserServiceError.UnknownError: return ErrorResult.create(UserUseCaseError.UnknownError);
				case UserServiceError.NotFoundUser: return ErrorResult.create(UserUseCaseError.NotFoundUser);
				case UserServiceError.PasswordTooSimple: return ErrorResult.create(UserUseCaseError.PasswordTooSimple);
				default: return ErrorResult.create(UserUseCaseError.UnknownError);
			}
		}

		return Result.create(userResult.value);
	}

	async deleteUser(userId: string): Promise<Either<UserUseCaseError, User>> {
		const userResult = await this.userService.delete(userId);

		if (userResult.isError()) {
			const { error } = userResult;

			switch (error) {
				case UserServiceError.UnknownError: return ErrorResult.create(UserUseCaseError.UnknownError);
				case UserServiceError.NotFoundUser: return ErrorResult.create(UserUseCaseError.NotFoundUser);
				default: return ErrorResult.create(UserUseCaseError.UnknownError);
			}
		}

		return Result.create(userResult.value);
	}
}