export interface IAuthManager {
	createToken(data: string): string
	getDataFromToken(token: string): string
}