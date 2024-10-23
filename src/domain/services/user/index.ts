import { InternalServerError, UserOperationError, UserOperationErrorMessages,  } from '@/domain/errors';
import { UserEntity } from '@/domain/entities/user';

import bcrypt from 'bcrypt';

interface IUserRepository {
	create(userEntity: UserEntity): Promise<UserEntity>
	findById(id: string): Promise<UserEntity | null>
	findByUsername(username: string): Promise<UserEntity | null>
	update(userEntity: UserEntity): Promise<UserEntity>
	delete(userId: string): Promise<void>
}

export class UserService {
	constructor(private userRepository: IUserRepository){}

	async create(userEntity: UserEntity): Promise<UserEntity> {
		const password = userEntity.password;

		if(this.isPasswordTooSimple(password)) {
			throw new UserOperationError(UserOperationErrorMessages.PasswordTooSimple);
		}

		try {
			userEntity.password = await this.generateHashPassword(password);
		} catch(e) {
			throw new InternalServerError('Error generate hash password');
		}

		try {
			const user = await this.userRepository.create(userEntity);
			return user; 
		} catch(e) {
			throw new InternalServerError('Error create user in data base');
		}
	}

	async findById(userId: string): Promise<UserEntity | null> {
		try {
			const user = await this.userRepository.findById(userId);
			return user; 
		} catch(e) {
			throw new InternalServerError('Error find user in data base');
		}
	}

	async findByUsername(username: string): Promise<UserEntity | null> {
		try {
			const user = await this.userRepository.findByUsername(username);
			return user; 
		} catch(e) {
			throw new InternalServerError('Error find user in data base');
		}
	}

	async update(userEntity: UserEntity): Promise<UserEntity> {
		try {
			const user = await this.userRepository.update(userEntity);
			return user; 
		} catch(e) {
			throw new InternalServerError('Error update user in data base');
		}
	}

	async delete(userId: string): Promise<void> {
		try {
			await this.userRepository.delete(userId);
		} catch(e) {
			throw new InternalServerError('Error delete user in data base');
		}
	}

	private isPasswordTooSimple(password: string | undefined): boolean {
		if(password === undefined || password === '') {
			return true;
		}

		return false;
	}

	private generateHashPassword(password: string | undefined): Promise<string> {
		if(password === undefined) {
			throw new Error('password is not be undefined');
		}

		return bcrypt.hash(password, 10);
	}
}