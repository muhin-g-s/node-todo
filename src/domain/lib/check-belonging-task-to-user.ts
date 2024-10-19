import { TaskEntity } from '@/domain/entities/task';

export function checkBelongingTaskToUser(taskEntity: TaskEntity | null, userId: string): boolean {
	return !!taskEntity && (taskEntity.id === userId);
}