import fetch from 'node-fetch'
import PQueue from 'p-queue'
import { LZTApiError } from './errors.js'

const DEFAULT_MIN_INTERVAL_BETWEEN_REQUESTS_MS = 3000

interface LZTApiCallerOptions {
	token?: string
	baseURLForum?: string
	baseURLMarket?: string
	interval_between_requests?: number
	locale?: string
	fetchParams?: Record<string, any>
}

export type { LZTApiCallerOptions }

export class LZTApiCaller {
	options: Required<LZTApiCallerOptions>
	queue: PQueue

	constructor(options: LZTApiCallerOptions = {}) {
		this.options = options as Required<LZTApiCallerOptions>
		if(this.options.interval_between_requests === undefined) {
			this.options.interval_between_requests = DEFAULT_MIN_INTERVAL_BETWEEN_REQUESTS_MS
		}
		this.queue = new PQueue({ concurrency: 1 })
	}

	async call(baseURL: string, method: string, path: string, params: Record<string, any> = {}): Promise<any> {
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
		const options: Record<string, any> = {
			...this.options.fetchParams,
			method,
			headers: {
				Authorization: `Bearer ${this.options.token}`,
				...this.options.fetchParams?.headers
			}
		}
		
		params.locale = params.locale || this.options.locale
		
		if(method === 'GET' || method === 'PUT' || method === 'DELETE') {
			for(const key of Object.keys(params))
				if(params[key] !== undefined) {
					if (Array.isArray(params[key])) {
						for (let i = 0; i < params[key].length; i++) {
							url.searchParams.set(`${key}[${i}]`, params[key][i])
						}
					} else {
						url.searchParams.set(key, params[key])
					}
				}
		} else {
			options.body = new FormData()
			for(const key of Object.keys(params))
				if(params[key] !== undefined)
					options.body.set(key, params[key])
		}
		
		const promise = this.queue.add(() => fetch(url.href, options))
		this.queue.add(() => new Promise(r => setTimeout(r, this.options.interval_between_requests)))
		const resp = await promise as any

		if(resp.status !== 200 && !resp.headers.get('content-type')?.includes("application/json")) {
			throw new LZTApiError(resp.statusText)
		}

		const json = await resp.json()
		
		if(json.errors)
			throw new LZTApiError(json.errors)
		if(json.error)
			throw new LZTApiError(json.error_description || json.error)
		
		return json
	}
}
