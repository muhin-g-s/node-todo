export type Task = {
	id: string;
	userId: string;
	title: string;
	description: string;
	isCompleted: boolean;
}

export type CreateTask = {
	userId: string;
	title: string;
	description: string;
	isCompleted: boolean;
}

export type FindTask = {
	id: string;
	userId: string;
}

export type UpdateTask = {
	userId: string;
	id: string;
} & (
		{
			title: string;
			description: string;
			isCompleted: boolean;
		} | {
			title: string;
			description?: never;
			isCompleted?: never;
		} | {
			title?: never;
			description?: never;
			isCompleted: boolean;
		} | {
			title?: never;
			description: string;
			isCompleted?: never;
		} | {
			title: string;
			description: string;
			isCompleted?: never;
		} | {
			title: string;
			description?: never;
			isCompleted: boolean;
		} | {
			title?: never;
			description: string;
			isCompleted: boolean;
		}
	)