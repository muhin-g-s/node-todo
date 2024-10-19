export const enum HttpErrorCode {
	InvalidResponse = 400,
	Unauthorized = 403,
	NotFound = 404,
	InternalError = 500,
}

export const enum HttpSuccessCode {
	Ok = 200,
}

export interface IHttpResponse {
	code: HttpErrorCode | HttpSuccessCode,
}