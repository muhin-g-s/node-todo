import { Auth, Login } from '@/domain/entities/auth';
import { UserCreate, User } from '@/domain/entities/user';

interface IAuthService {
	login(login: Login): Promise<Auth>;
}

interface IUserService {
	create(user: UserCreate): Promise<User>;
}

export class UseCaseAuth {
	constructor(private authService: IAuthService, private userService: IUserService) { }

	async register(user: UserCreate): Promise<User> {
		return this.userService.create(user);
	}

	async login(login: Login): Promise<Auth> {
		return this.authService.login(login);
	}
}