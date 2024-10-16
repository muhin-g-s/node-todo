import { IAuthManager } from '../../../pkg/auth-manager';
import { AuthEntity } from '../../entities/user';
import { UserEntity } from '../../entities/user';
import { UserService } from '../../services/user';

import bcrypt from 'bcrypt';

export class UseCaseAuth {
	constructor(private authManager: IAuthManager, private userService: UserService) {}

	async register(userEntity: UserEntity): Promise<UserEntity> {
		const hashPassword = await bcrypt.hash(userEntity.password!, 10);

		const user: UserEntity = {...userEntity, password: hashPassword};

		return this.userService.create(user);
	}
}