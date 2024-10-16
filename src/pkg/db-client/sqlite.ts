import { User } from '../../repository/typed-orm/user/dto';
import { DataSource } from 'typeorm';

export const sqliteClient = new DataSource({
	type: "sqlite",
	database: "sqlite.sql",
	synchronize: true,
	entities: [User],
})