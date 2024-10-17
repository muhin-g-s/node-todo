import { UserService } from '../../services/user';
import { UserEntity } from '../../entities/user';

export class UseCaseUser {
	constructor(private userService: UserService) {}

	getUser(userId: string): Promise<UserEntity>{
		return this.userService.findById(userId);
	}

	updateUser(userEntity: UserEntity): Promise<UserEntity>{
		return this.userService.update(userEntity);
	}

	async deleteUser(userId: string): Promise<void> {
		await this.userService.delete(userId);
	}
}