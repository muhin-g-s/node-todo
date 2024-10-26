export type UserCreate = {
	username: string;
	password: string;
}

export type ExistedUser = {
	id: string;
	username: string;
	password: string;
}

export type UpdateUser =
	{
		id: string;
	} & ({
		username: string;
		password?: never;
	} | {
		username?: never;
		password: never;
	} | {
		username: string;
		password: string;
	});

export type User = {
	id: string;
	username: string;
	password: string;
}