
import jwt from 'jsonwebtoken';
const verySecretKey = 'verySecretKey';

export class AuthManager {
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