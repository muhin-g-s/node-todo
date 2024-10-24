export class UserEntity {
	id: string;
	username: string;
	password: string;
	createdAt: Date | null;
	updatedAt: Date | null;
	deleteAt: Date | null;
}