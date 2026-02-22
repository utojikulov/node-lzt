import { LZTApi } from './dist/api.js'

const api = new LZTApi({ token: 'b5f0a0cadb79603f07ff8bf53255d3de0a478acf' })

const example = async () => {
	console.log(await api.market.getPayments())
}

example().catch(console.error)
