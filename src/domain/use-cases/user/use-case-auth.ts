import { IAuthManager } from '../../../pkg/auth-manager';
import { AuthEntity } from '../../entities/user';
import { UserEntity } from '../../entities/user';
import { UserService } from '../../services/user';

import bcrypt from 'bcrypt';

export class UseCaseAuth {
	constructor(private authManager: IAuthManager, private userService: UserService) {}

	async register(userEntity: UserEntity): Promise<UserEntity> {
		const hashPassword = await bcrypt.hash(userEntity.password!, 'qwerty');

		const user: UserEntity = {...userEntity, password: hashPassword};

		return this.userService.create(user);
	}

	async login(userEntity: UserEntity): Promise<AuthEntity> {
			const user = await this.userService.findByUsername(userEntity.username!);

			const resultComparePassword = await bcrypt.compare(userEntity.password!, user.password!);

			if(!resultComparePassword) {
				throw new Error('TODO password not compare');
			}
			
			const token = this.authManager.createToken(user.id!);

			return {
				token,
				userId: user.id!
			}
	}
}