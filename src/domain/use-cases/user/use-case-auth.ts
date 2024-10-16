import { IAuthManager } from '../../../pkg/auth-manager';
import { AuthEntity } from '../../entities/user';
import { UserEntity } from '../../entities/user';
import { UserService } from '../../services/user';

import bcrypt from 'bcrypt';

export class UseCaseAuth {
	constructor(private authManager: IAuthManager, private userService: UserService) {}

	async register(userEntity: UserEntity): Promise<UserEntity> {

		const password = userEntity.password;

		if(!this.checkPasswordComplexity(password)) {
			throw new Error('sdlnsdklsmd');
		}

		userEntity.password = await this.generateHashPassword(password);

		return this.userService.create(userEntity);
	}

	async login(userEntity: UserEntity): Promise<AuthEntity> {
		const user = await this.userService.findByUsername(userEntity.username!);

		if(!await this.comparePassword(userEntity.password, user.password)) {
			throw new Error('TODO password not compare');
		}
		
		const token = this.authManager.createToken(user.id!);

		return {
			token,
			userId: user.id!
		}
	}

	private checkPasswordComplexity(password: string): boolean {
		if(password === '') {
			return false;
		}

		return true;
	}

	private async generateHashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	private async comparePassword(supposedPassword: string, realPassword: string): Promise<boolean> {
		return bcrypt.compare(supposedPassword, realPassword);
	}
}