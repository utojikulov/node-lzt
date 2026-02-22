import * as LZTApiGroups from './api/index.js'
import { LZTApiCaller } from './caller.js'
import type { LZTApiCallerOptions } from './caller.js'
import type { LZTApiUsersGroup } from './api/users.js'
import type { LZTApiMarketGroup } from './api/market.js'
import { LZTApiGroup } from './apiGroup.js'

interface LZTApiOptions extends LZTApiCallerOptions {
	baseURLMarket?: string
	baseURLForum?: string
	locale?: string
}

type ApiGroupClass = typeof LZTApiGroup
type ApiGroupInstance = LZTApiGroup & { constructor: ApiGroupClass & { apiName?: string } }

export class LZTApi {
	readonly options: LZTApiOptions
	readonly caller: LZTApiCaller
	readonly users!: LZTApiUsersGroup
	readonly market!: LZTApiMarketGroup
	[key: string]: unknown

	constructor(options: LZTApiOptions) {
		this.options = {
			baseURLMarket: 'https://api.lzt.market/',
			baseURLForum: 'https://api.zelenka.guru/',
			locale: 'ru',
			...options
		}

		this.caller = new LZTApiCaller(this.options)

		for (const key in LZTApiGroups) {
			const GroupClass = LZTApiGroups[key as keyof typeof LZTApiGroups]
			if (typeof GroupClass === 'function' && ('apiName' in GroupClass || key === 'LZTApiUsersGroup' || key === 'LZTApiMarketGroup')) {
				try {
					const instance = new (GroupClass as unknown as { new(caller: LZTApiCaller): ApiGroupInstance })(this.caller)
					if (instance && instance.constructor && 'apiName' in instance.constructor) {
						const apiName = (instance.constructor as unknown as { apiName?: string }).apiName
						if (apiName) {
							this[apiName] = instance
						}
					}
				} catch (error) {
                    // todo: error handling implementation
                    // throw new Error(``)
				}
			}
		}
	}
}
