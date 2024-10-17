import { IUserRepository } from '../../../repository/user';
import { UserEntity } from '../../entities/user';

export class UserService {
	constructor(private userRepository: IUserRepository){}

	create(userEntity: UserEntity): Promise<UserEntity> {
		return this.userRepository.create(userEntity);
	}

	findById(userId: string): Promise<UserEntity> {
		return this.userRepository.findById(userId);
	}

	findByUsername(username: string): Promise<UserEntity> {
		return this.userRepository.findByUsername(username);
	}

	update(userEntity: UserEntity): Promise<UserEntity> {
		return this.userRepository.update(userEntity);
	}

	async delete(userId: string): Promise<void> {
		await this.userRepository.delete(userId);
	}
}