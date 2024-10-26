export type Either<T, U> = ErrorResult<T> | Result<U>;

export class ErrorResult<T> {
	readonly error: T;

	private constructor(error: T) {
		this.error = error;
	}

	isError(): this is ErrorResult<T> {
		return true;
	}

	isResult(): this is Result<never> {
		return false;
	}

	static create<U>(error: U): ErrorResult<U> {
		return new ErrorResult(error);
	}
}

export class Result<T> {
	readonly value: T;

	private constructor(value: T) {
		this.value = value;
	}

	isError(): this is ErrorResult<never> {
		return false;
	}

	isResult(): this is Result<T> {
		return true;
	}

	static create<U>(value: U): Result<U> {
		return new Result(value);
	}
}