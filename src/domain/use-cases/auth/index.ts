import { Auth, Login } from '@/domain/entities/auth';
import { UserCreate, User } from '@/domain/entities/user';
import { AuthServiceError, AuthUseCaseError } from '@/domain/errors/auth';
import { UserServiceError } from '@/domain/errors/user';
import { Either, ErrorResult, Result } from '@/lib';

interface IAuthService {
	login(login: Login): Promise<Either<AuthServiceError, Auth>>;
}

interface IUserService {
	create(user: UserCreate): Promise<Either<UserServiceError, User>>;
}

export class UseCaseAuth {
	constructor(private authService: IAuthService, private userService: IUserService) { }

	async register(user: UserCreate): Promise<Either<AuthUseCaseError, User>> {
		const createUserResult = await this.userService.create(user);

		if (createUserResult.isError()) {
			const { error } = createUserResult;

			switch (error) {
				case UserServiceError.UnknownError: return ErrorResult.create(AuthUseCaseError.UnknownError);
				case UserServiceError.NotFoundUser: return ErrorResult.create(AuthUseCaseError.NotFoundUser);
				case UserServiceError.AlreadyExist: return ErrorResult.create(AuthUseCaseError.AlreadyExist);
				case UserServiceError.PasswordTooSimple: return ErrorResult.create(AuthUseCaseError.PasswordTooSimple);
				default: return ErrorResult.create(AuthUseCaseError.UnknownError);
			}
		}

		return Result.create(createUserResult.value);
	}

	async login(login: Login): Promise<Either<AuthUseCaseError, Auth>> {
		const loginResult = await this.authService.login(login);

		if (loginResult.isError()) {
			const { error } = loginResult;

			switch (error) {
				case AuthServiceError.UnknownError: return ErrorResult.create(AuthUseCaseError.UnknownError);
				case AuthServiceError.NotFoundUser: return ErrorResult.create(AuthUseCaseError.NotFoundUser);
				case AuthServiceError.PasswordNotCompare: return ErrorResult.create(AuthUseCaseError.PasswordNotCompare);
				default: return ErrorResult.create(AuthUseCaseError.UnknownError);
			}
		}

		return Result.create(loginResult.value);
	}
}