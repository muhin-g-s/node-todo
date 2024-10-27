import { Auth, Login } from '@/domain/entities/auth';
import { ExistedUser } from '@/domain/entities/user';
import { Either, ErrorResult, Result } from '@/lib';

const enum RepositoryError {
	UnknownError,
	NotFoundUser,
}

const enum ServiceError {
	UnknownError,
	NotFoundUser,
	PasswordNotCompare,
}

interface IUserRepository {
	findByUsername(username: string): Promise<Either<RepositoryError, ExistedUser>>
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

	async login(login: Login): Promise<Either<ServiceError, Auth>> {
		const resultFindByName = await this.userRepository.findByUsername(login.username);

		if (resultFindByName.isError()) {
			const { error } = resultFindByName;

			switch (error) {
				case RepositoryError.UnknownError: return ErrorResult.create(ServiceError.UnknownError);
				case RepositoryError.NotFoundUser: return ErrorResult.create(ServiceError.NotFoundUser);
				default: return ErrorResult.create(ServiceError.UnknownError);
			}
		}

		const existedUser = resultFindByName.value;

		const isCompareResult = await this.passwordService.passwordAuthentication(login.password, existedUser.password);

		if (isCompareResult.isError()) {
			return ErrorResult.create(ServiceError.UnknownError);
		}

		if (!isCompareResult.value) {
			return ErrorResult.create(ServiceError.PasswordNotCompare);
		}

		const token = this.authManager.createToken(existedUser.id);

		return Result.create({
			token,
			userId: existedUser.id,
			username: existedUser.username
		});
	}
}