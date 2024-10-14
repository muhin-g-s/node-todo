import jwt from 'jsonwebtoken';
import { IAuthManager } from './interface-auth-manager';

const verySecretKey = 'verySecretKey';

export class AuthManager implements IAuthManager {
	private key = 'data' as const;

	createToken(data: string): string {
		return jwt.sign({ [this.key]: data }, verySecretKey);
	}

	getDataFromToken(token: string): {data: string, err: boolean} {
		const key = this.key;

		try {
			return {data: (jwt.verify(token, verySecretKey) as {[key]: string})[key], err: false};
		} catch {
			return {
				data: '',
				err: true, 
			}
		}

	} 
}