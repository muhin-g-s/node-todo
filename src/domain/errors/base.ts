export const enum DomainErrorNames {
	BusinessLogicError = 'Business logic error',
	InternalServerError = 'Internal server error'
}

export class DomainError extends Error {
	constructor(name: DomainErrorNames, message: string) {
			super(message);
			this.name = name;
	}
}

export class BusinessLogicError extends DomainError {
	constructor(message: string) {
		super(DomainErrorNames.BusinessLogicError, message);
	}
}

export class InternalServerError extends DomainError {
	constructor(message: string) {
		super(DomainErrorNames.BusinessLogicError, message);
	}
}