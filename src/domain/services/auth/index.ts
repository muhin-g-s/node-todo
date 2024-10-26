import { Auth, Login } from '@/domain/entities/auth';
import { ExistedUser } from '@/domain/entities/user';
import bcrypt from 'bcrypt';

interface IUserRepository {
	findByUsername(username: string): Promise<ExistedUser>
}

interface IAuthManager {
	createToken(data: string): string
	getDataFromToken(token: string): string
}

export class AuthService {
	constructor(private userRepository: IUserRepository, private authManager: IAuthManager){}

	async login(login: Login): Promise<Auth> {
		const existedUser = await this.userRepository.findByUsername(login.username);

		const isCompare = await this.passwordAuthentication(login.password, existedUser.password);

		if(!isCompare) {
			throw new Error('Error');
		}

		const token = this.authManager.createToken(existedUser.id);

		return {
			token,
			userId: existedUser.id,
			username: existedUser.username
		}
	}

	private async passwordAuthentication(data: string, encrypted: string): Promise<boolean> {
		const isCompare = await bcrypt.compare(data, encrypted);
		return isCompare;
	}
}