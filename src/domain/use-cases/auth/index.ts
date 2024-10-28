import { Auth, Login } from '@/domain/entities/auth';
import { UserCreate, User } from '@/domain/entities/user';
import { 
	AuthServiceError, 
	AuthServiceLoginError, 
	AuthUseCaseError, 
	AuthUseCaseLoginError, 
	AuthUseCaseRegisterError 
} from '@/domain/errors/auth';
import { UserServiceCreateError, UserServiceError } from '@/domain/errors/user';
import { Either, ErrorResult, Result } from '@/lib';

interface IAuthService {
	login(login: Login): Promise<Either<AuthServiceLoginError, Auth>>;
}

interface IUserService {
	create(user: UserCreate): Promise<Either<UserServiceCreateError, User>>;
}

export class UseCaseAuth {
	constructor(private authService: IAuthService, private userService: IUserService) { }

	async register(user: UserCreate): Promise<Either<AuthUseCaseRegisterError, User>> {
		const createUserResult = await this.userService.create(user);

		if (createUserResult.isError()) {
			const { error } = createUserResult;

			switch (error) {
				case UserServiceError.UnknownError: return ErrorResult.create(AuthUseCaseError.UnknownError);
				case UserServiceError.AlreadyExist: return ErrorResult.create(AuthUseCaseError.AlreadyExist);
				case UserServiceError.PasswordTooSimple: return ErrorResult.create(AuthUseCaseError.PasswordTooSimple);
			}
		}

		return Result.create(createUserResult.value);
	}

	async login(login: Login): Promise<Either<AuthUseCaseLoginError, Auth>> {
		const loginResult = await this.authService.login(login);

		if (loginResult.isError()) {
			const { error } = loginResult;

			switch (error) {
				case AuthServiceError.UnknownError: return ErrorResult.create(AuthUseCaseError.UnknownError);
				case AuthServiceError.NotFoundUser: return ErrorResult.create(AuthUseCaseError.NotFoundUser);
				case AuthServiceError.PasswordNotCompare: return ErrorResult.create(AuthUseCaseError.PasswordNotCompare);
			}
		}

		return Result.create(loginResult.value);
	}
}