import jwt from 'jsonwebtoken';
import { IAuthManager } from './interface-auth-manager';

const verySecretKey = 'verySecretKey';

export class AuthManager implements IAuthManager {
	createToken(data: string): string {
		return jwt.sign(data, verySecretKey);
	}

	getDataFromToken(token: string): string {
		try {
			return jwt.verify(token, verySecretKey) as string;
		} catch {
			throw new Error('Not verify');
		}
	} 
}