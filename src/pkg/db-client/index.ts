import { Task } from '@/repository/typed-orm/task/model';
import { User } from '@/repository/typed-orm/user/model';
import { DataSource } from 'typeorm';

export const sqliteClient = new DataSource({
	type: "sqlite",
	database: "sqlite.sql",
	synchronize: true,
	entities: [User, Task],
})