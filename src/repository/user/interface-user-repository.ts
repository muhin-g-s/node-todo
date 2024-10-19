import { UserEntity } from '@/domain/entities/user'

export interface IUserRepository {
	create(userEntity: UserEntity): Promise<UserEntity>
	findById(id: string): Promise<UserEntity | null>
	findByUsername(username: string): Promise<UserEntity | null>
	update(userEntity: UserEntity): Promise<UserEntity>
	delete(userId: string): Promise<void>
}