import { ExistedUser, UpdateUser, UserCreate, User } from '@/domain/entities/user';

import bcrypt from 'bcrypt';

interface IUserRepository {
	save(user: UserCreate): Promise<ExistedUser>
	findById(id: string): Promise<ExistedUser>
	findByUsername(username: string): Promise<ExistedUser>
	update(user: ExistedUser): Promise<ExistedUser>
	delete(userId: string): Promise<void>
}

export class UserService {
	constructor(private userRepository: IUserRepository) { }

	async create({ username, password }: UserCreate): Promise<User> {
		const existUser = await this.userRepository.findByUsername(username);

		if (existUser) {
			throw new Error('Error');
		}

		if ((this.isPasswordTooSimple(password))) {
			throw new Error('Error');
		}

		const passwordHash = await this.generateHashPassword(password);

		const newUser = await this.userRepository.save({ username, password: passwordHash });

		return newUser;
	}

	async findById(userId: string): Promise<User> {
		const user = await this.userRepository.findById(userId);

		return user;
	}

	async findByUsername(username: string): Promise<User> {
		const user = await this.userRepository.findByUsername(username);

		return user;
	}

	async update(updateUser: UpdateUser): Promise<User> {
		let updatedAndSaveUser: User;

		if (!updateUser.password || !updateUser.username) {
			updatedAndSaveUser = await this.updateNotFullFilled(updateUser);
		} else {
			updatedAndSaveUser = await this.updateFullFilled(updateUser);
		}

		return updatedAndSaveUser;
	}

	async delete(userId: string): Promise<User> {
		const existUser = await this.findById(userId);
		await this.userRepository.delete(existUser.id);
		return existUser;
	}

	private async updateNotFullFilled(updateUser: UpdateUser): Promise<User> {
		const existUser = await this.findById(updateUser.id);

		if (updateUser.password) {

			if (this.isPasswordTooSimple(updateUser.password)) {
				throw new Error('Error');
			};

			const passwordHash = await this.generateHashPassword(updateUser.password);

			existUser.password = passwordHash;
		}

		if (updateUser.username) {
			existUser.username = updateUser.username
		}

		const updatedAndSaveUser = await this.update(updateUser);

		return updatedAndSaveUser;
	}

	private async updateFullFilled(updateUser: UpdateUser): Promise<User> {
		if (this.isPasswordTooSimple(updateUser.password!)) {
			throw new Error('Error');
		};

		const updatedAndSaveUser = await this.update(updateUser);

		return updatedAndSaveUser;
	}

	private isPasswordTooSimple(password: string): boolean {
		if (password === '') {
			return true;
		}

		return false;
	}

	private generateHashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}
}