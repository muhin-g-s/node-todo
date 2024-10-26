import { UserService } from '@/domain/services/user';
import { UpdateUser, User } from '@/domain/entities/user';

interface IUserService {
	findById(userId: string): Promise<User>;
	update(updateUser: UpdateUser): Promise<User>;
	delete(userId: string): Promise<User>;
}

export class UseCaseUser {
	constructor(private userService: UserService) { }

	getUser(userId: string): Promise<User> {
		return this.userService.findById(userId);
	}

	updateUser(user: UpdateUser): Promise<User> {
		return this.userService.update(user);
	}

	deleteUser(userId: string): Promise<User> {
		return this.userService.delete(userId);
	}
}