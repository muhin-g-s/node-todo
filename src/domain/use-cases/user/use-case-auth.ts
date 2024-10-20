import { AuthEntity } from '@/domain/entities/user';
import { UserEntity } from '@/domain/entities/user';
import { UserService } from '@/domain/services/user';

import bcrypt from 'bcrypt';
import { InternalServerError, UserOperationError, UserOperationErrorMessages } from '@/domain/errors';

interface IAuthManager {
	createToken(data: string): string
	getDataFromToken(token: string): string
}

export class UseCaseAuth {
	constructor(private authManager: IAuthManager, private userService: UserService) {}

	register(userEntity: UserEntity): Promise<UserEntity> {
		return this.userService.create(userEntity);
	}

	async login(userEntity: UserEntity): Promise<AuthEntity> {
		const user = await this.userService.findByUsername(userEntity.username);

		if(!user) {
			throw new UserOperationError(UserOperationErrorMessages.UserNotExist);
		}

		if(!await this.comparePassword(userEntity.password, user.password)) {
			throw new UserOperationError(UserOperationErrorMessages.PasswordNotCompare);
		}
		
		const token = this.authManager.createToken(user.id!);

		return {
			token,
			userId: user.id,
			username: user.username
		}
	}

	private async comparePassword(supposedPassword: string, realPassword: string): Promise<boolean> {
		try {
			const isCompare = await bcrypt.compare(supposedPassword, realPassword);
			return isCompare;
		} catch {
			throw new InternalServerError('Error while comparing passwords');
		}
	}
}