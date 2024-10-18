import { UserEntity } from '@/domain/entities/user'

export interface IUserRepository {
	create(userEntity: UserEntity): Promise<UserEntity>
	findById(id: string): Promise<UserEntity>
	findByUsername(username: string): Promise<UserEntity>
	update(userEntity: UserEntity): Promise<UserEntity>
	delete(userId: string): Promise<void>
}