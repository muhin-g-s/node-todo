import { Auth, Login } from '@/domain/entities/auth';
import { ExistedUser } from '@/domain/entities/user';
import { AuthServiceError } from '@/domain/errors/auth';
import { UserRepositoryError } from '@/domain/errors/user';
import { Either, ErrorResult, Result } from '@/lib';

interface IUserRepository {
	findByUsername(username: string): Promise<Either<UserRepositoryError, ExistedUser>>
}

interface IAuthManager {
	createToken(data: string): string
	getDataFromToken(token: string): string
}

interface IPasswordService {
	passwordAuthentication(data: string, encrypted: string): Promise<Either<void, boolean>>
}

export class AuthService {
	constructor(
		private userRepository: IUserRepository,
		private authManager: IAuthManager,
		private passwordService: IPasswordService
	) { }

	async login(login: Login): Promise<Either<AuthServiceError, Auth>> {
		const resultFindByName = await this.userRepository.findByUsername(login.username);

		if (resultFindByName.isError()) {
			const { error } = resultFindByName;

			switch (error) {
				case UserRepositoryError.UnknownError: return ErrorResult.create(AuthServiceError.UnknownError);
				case UserRepositoryError.NotFoundUser: return ErrorResult.create(AuthServiceError.NotFoundUser);
				default: return ErrorResult.create(AuthServiceError.UnknownError);
			}
		}

		const existedUser = resultFindByName.value;

		const isCompareResult = await this.passwordService.passwordAuthentication(login.password, existedUser.password);

		if (isCompareResult.isError()) {
			return ErrorResult.create(AuthServiceError.UnknownError);
		}

		if (!isCompareResult.value) {
			return ErrorResult.create(AuthServiceError.PasswordNotCompare);
		}

		const token = this.authManager.createToken(existedUser.id);

		return Result.create({
			token,
			userId: existedUser.id,
			username: existedUser.username
		});
	}
}