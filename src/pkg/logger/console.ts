export class ErrorLogger {
  logError(error: Error): void {
		console.error(error);
	}

  logInfo(message: string): void {
		console.log(message);
	}

  logWarning(message: string): void {
		console.warn(message);
	}
}