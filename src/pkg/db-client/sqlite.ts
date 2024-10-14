import { DataSource } from 'typeorm';

export const sqliteClient = new DataSource({
	type: "sqlite",
	database: "sqlite.sql",
})