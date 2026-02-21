import { LZTApiCaller } from './caller.js'

export class LZTApiGroup {
	caller: LZTApiCaller

	constructor(caller: LZTApiCaller) {
		this.caller = caller
	}
}
