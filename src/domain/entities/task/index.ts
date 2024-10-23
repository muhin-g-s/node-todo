export class TaskEntity {
	id: string;
	userId: string;
	title: string;
	description: string;
	isCompleted: boolean;
	createdAt: Date | null;
	updatedAt: Date | null;
	deleteAt: Date | null;

	constructor(
    id: string,
    userId: string,
    title: string,
    description: string,
    isCompleted: false,
    createdAt: Date, 
		updatedAt: Date, 
		deleteAt: Date
  ) {
		this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deleteAt = deleteAt;
  }
}