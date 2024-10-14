export class UserEntity {
	id: string;
	username: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	deleteAt: Date;

	constructor(id: string, username: string, password: string, createdAt: Date, updatedAt: Date, deleteAt: Date) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.deleteAt = deleteAt;
	}
}