export class LZTApiError extends Error {
	constructor(error: string | string[]) {
		super(
			typeof error === 'string'
				? error
				: error.join('\n')
		)
	}
}
