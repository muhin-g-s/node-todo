import { UserEntity } from '@/domain/entities/user';
import { IUserRepository } from '@/repository/user';

export class UserService {
	constructor(private userRepository: IUserRepository){}

	create(userEntity: UserEntity): Promise<UserEntity> {
		return this.userRepository.create(userEntity);
	}

	findById(userId: string): Promise<UserEntity | null> {
		return this.userRepository.findById(userId);
	}

	findByUsername(username: string): Promise<UserEntity | null> {
		return this.userRepository.findByUsername(username);
	}

	update(userEntity: UserEntity): Promise<UserEntity> {
		return this.userRepository.update(userEntity);
	}

	async delete(userId: string): Promise<void> {
		await this.userRepository.delete(userId);
	}
}