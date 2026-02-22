import fetch, { type Response } from 'node-fetch'
import PQueue from 'p-queue'
import { LZTApiError } from './errors.js'

const DEFAULT_MIN_INTERVAL_BETWEEN_REQUESTS_MS = 3000

interface LZTApiCallerOptions {
	token?: string
	baseURLForum?: string
	baseURLMarket?: string
	interval_between_requests?: number
	locale?: string
	fetchParams?: Record<string, unknown>
}

export type { LZTApiCallerOptions }

export class LZTApiCaller {
	options: Required<LZTApiCallerOptions>
	queue: PQueue

	constructor(options: LZTApiCallerOptions = {}) {
		this.options = {
			token: options.token,
			baseURLForum: options.baseURLForum || '',
			baseURLMarket: options.baseURLMarket || '',
			interval_between_requests: options.interval_between_requests ?? DEFAULT_MIN_INTERVAL_BETWEEN_REQUESTS_MS,
			locale: options.locale || 'ru',
			fetchParams: options.fetchParams || {}
		} as Required<LZTApiCallerOptions>
		this.queue = new PQueue({ concurrency: 1 })
	}

	async call<T = unknown>(
		baseURL: string,
		method: string,
		path: string,
		params: Record<string, unknown> = {}
	): Promise<T> {
		let url: URL
		switch (baseURL) {
			case 'forum':
				url = new URL(path, this.options.baseURLForum)
				break
			case 'market':
				url = new URL(path, this.options.baseURLMarket)
				break
			default:
				throw new LZTApiError('Invalid baseUrl passed.')
		}

		const requestParams: Record<string, unknown> = {
			...params,
			locale: params.locale ?? this.options.locale
		}

		const requestOptions: Record<string, unknown> = {
			...this.options.fetchParams,
			method,
			headers: {
				Authorization: `Bearer ${this.options.token}`,
				...(this.options.fetchParams?.headers as Record<string, string> | undefined)
			}
		}
		
		if(method === 'GET' || method === 'PUT' || method === 'DELETE') {
			for(const key of Object.keys(requestParams)) {
				const value = requestParams[key] as unknown
				if(value !== undefined && value !== null) {
					if (Array.isArray(value)) {
						for (let i = 0; i < value.length; i++) {
							url.searchParams.set(`${key}[${i}]`, String(value[i]))
						}
					} else {
						url.searchParams.set(key, String(value))
					}
				}
			}
		} else {
			const formData = new FormData()
			for(const key of Object.keys(requestParams)) {
				const value = requestParams[key] as unknown
				if(value !== undefined && value !== null)
					formData.set(key, String(value))
			}
			requestOptions.body = formData
		}
		
		const promise = this.queue.add(() => fetch(url.href, requestOptions as Parameters<typeof fetch>[1]))
		this.queue.add(() => new Promise(r => setTimeout(r, this.options.interval_between_requests)))
		const resp: Response = await promise as unknown as Response

		if(resp.status !== 200 && !resp.headers.get('content-type')?.includes("application/json")) {
			throw new LZTApiError(resp.statusText)
		}

		const json = await resp.json() as Record<string, unknown>
		
		if(json.errors)
			throw new LZTApiError(json.errors as string | string[])
		if(json.error)
			throw new LZTApiError((json.error_description as string) || (json.error as string))
		
		return json as T
	}
}
