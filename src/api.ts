import * as LZTApiGroups from './api/index.js'
import { LZTApiCaller } from './caller.js'
import type { LZTApiCallerOptions } from './caller.js'

interface LZTApiOptions extends LZTApiCallerOptions {
	baseURLMarket?: string
	baseURLForum?: string
	locale?: string
}

export class LZTApi {
	options: LZTApiOptions
	caller: LZTApiCaller

	constructor(options: LZTApiOptions) {
		this.options = {
			baseURLMarket: 'https://api.lzt.market/',
			baseURLForum: 'https://api.zelenka.guru/',
			locale: 'ru',
			...options
		}
		
		this.caller = new LZTApiCaller(this.options)
		
		for(const key in LZTApiGroups) {
			const Group = LZTApiGroups[key as keyof typeof LZTApiGroups] as any
			const group = new Group(this.caller)
			;(this as any)[Group.apiName] = group
		}
	}
}
