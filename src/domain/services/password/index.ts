import { Either, ErrorResult, Result } from '@/lib';

import bcrypt from 'bcrypt';

export class PasswordService {
	checkComplexity(password: string): boolean {
		if (password === '') {
			return true;
		}

		return false;
	}

	async generateHash(password: string): Promise<Either<void, string>> {
		try {
			const encryptedPassword = await bcrypt.hash(password, 10);
			return Result.create(encryptedPassword);
		} catch {
			return ErrorResult.create(undefined);
		}
	}

	private async passwordAuthentication(data: string, encrypted: string): Promise<Either<void, boolean>> {
		try {
			const isCompare = await bcrypt.compare(data, encrypted);
			return Result.create(isCompare);
		} catch {
			return ErrorResult.create(undefined);
		}
	}
}