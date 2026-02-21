import { LZTApiGroup } from '../apiGroup.js'
import { LZTApiError } from '../errors.js'

export class LZTApiMarketGroup extends LZTApiGroup {
	static readonly apiName = 'market'
	
	#userId: number | null = null
	
	async #getMyUserId(): Promise<number> {
		if(!this.#userId)
			await this.getUser()
		
		if(!this.#userId)
			throw new LZTApiError('Cannot get my userId')
		
		return this.#userId
	}
	
	async search({
		categoryName = null,
		pmin, pmax, title,
		showStickyItems,
		...categoryParams
	}: Record<string, any> = {}): Promise<any> {
		return await this.caller.call(
			'market',
			'GET',
			categoryName ? `/${categoryName}` : '/',
			{
				pmin, pmax, title,
				showStickyItems: showStickyItems ? 1 : undefined,
				...categoryParams
			}
		)
	}
	
	async getUser(): Promise<any> {
		const resp = await this.caller.call('market', 'GET', '/user')
		
		if(!this.#userId && resp?.user?.user_id)
			this.#userId = resp.user.user_id
		
		return resp
	}
	
	async getUserItems({
		userId = null,
		categoryId,
		pmin, pmax,
		title,
		...categoryParams
	}: Record<string, any> = {}): Promise<any> {
		if(!userId)
			userId = await this.#getMyUserId()
		
		return await this.caller.call('market', 'GET', `/user/${userId}/items/`, {
			category_id: categoryId,
			pmin, pmax,
			title,
			...categoryParams
		})
	}
	
	async getPayments({
		userId = null,
		type, pmin, pmax,
		receiver, sender,
		startDate, endDate,
		wallet, comment, isHold
	}: Record<string, any> = {}): Promise<any> {
		if(!userId)
			userId = await this.#getMyUserId()
		
		return await this.caller.call('market', 'GET', `/user/${userId}/payments`, {
			type, pmin, pmax,
			receiver, sender,
			startDate, endDate,
			wallet, comment,
			is_hold: isHold ? 1 : undefined
		})
	}
	
	async getOrders({
		userId = null,
		categoryId,
		pmin, pmax,
		title,
		...categoryParams
	}: Record<string, any> = {}): Promise<any> {
		if(!userId)
			userId = await this.#getMyUserId()
		
		return await this.caller.call('market', 'GET', `/user/${userId}/orders`, {
			category_id: categoryId,
			pmin, pmax,
			title,
			...categoryParams
		})
	}
	
	async getFave(): Promise<any> {
		return await this.caller.call('market', 'GET', '/fave')
	}
	
	async getViewed(): Promise<any> {
		return await this.caller.call('market', 'GET', '/viewed')
	}
	
	async getItem({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}`)
	}
	
	async reserve({ itemId, price }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/reserve`, { price })
	}
	
	async cancelReserve({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/cancel-reserve`)
	}
	
	async checkAccount({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/check-account`)
	}
	
	async confirmBuy({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/confirm-buy`)
	}

	async fastBuy({ itemId, price, skipValidation }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/fast-buy`, {
			buy_without_validation: skipValidation ? 1 : undefined,
			price
		})
	}
	
	async transfer({
		userId, username,
		amount, currency,
		secretAnswer,
		holdLengthValue,
		holdLengthOption
	}: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', '/balance/transfer/', {
			user_id: userId,
			username, amount, currency,
			secret_answer: secretAnswer,
			transfer_hold: holdLengthValue ? 1 : undefined,
			hold_length_value: holdLengthValue,
			hold_length_option: holdLengthOption
		})
	}
	
	async addItem({
		title, titleEn,
		price,
		categoryId,
		currency,
		itemOrigin,
		description, information,
		emailLoginData,
		emailType,
		allowAskDiscount
	}: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', '/item/add/', {
			title,
			title_en: titleEn,
			price,
			category_id: categoryId,
			currency,
			item_origin: itemOrigin,
			description, information,
			has_email_login_data: emailLoginData ? 1 : undefined,
			email_login_data: emailLoginData,
			email_type: emailType,
			allow_ask_discount: allowAskDiscount
		})
	}

	async getNotPublishedItem({ itemId, resellItemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/goods/add/`, { resell_item_id: resellItemId })
	}

	async checkItem({ itemId, closeItem }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/goods/check`, {
			close_item: closeItem
		})
	}
	
	async getEmailCode({ itemId, email }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/email-code/`, { email })
	}

	async refuseGuarantee({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/refuse-guarantee`)
	}
	
	async changePassword({ itemId, _cancel }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/change-password`, {
			_cancel: _cancel ? 1 : undefined
		})
	}
	
	async editItem({
		itemId, currency, ...fields
	}: Record<string, any> = {}): Promise<any> {
		const params: Record<string, any> = { currency }
		
		const transformField = (field: string) =>
			field.replace(/[A-Z]/g, char => `_${char.toLowerCase()}`)
		
		for(const key of Object.keys(fields))
			params[`key_values[${transformField(key)}]`] = typeof fields[key] === 'boolean'
				? fields[key]
					? 1
					: undefined
				: fields[key]
		
		return await this.caller.call('market', 'POST', `/${itemId}/edit/`, params)
	}
	
	async addTag({ itemId, tagId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/tag/`, { tag_id: tagId })
	}
	
	async deleteTag({ itemId, tagId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'DELETE', `/${itemId}/tag/`, { tag_id: tagId })
	}

	async deleteItem({ itemId, reason }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'DELETE', `/${itemId}`, { reason })
	}

	async getMafile({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/mafile/`)
	}

	async getGuardCode({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/guard-code/`)
	}

	async getTelegramCode({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/telegram-login-code/`)
	}

	async resetTelegramAuth({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/telegram-reset-authorizations/`)
	}

	async getTempEmailPassword({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/temp-email-password/`)
	}

	async fave({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/star/`)
	}

	async unFave({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'DELETE', `/${itemId}/star/`)
	}

	async stickItem({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/stick/`)
	}

	async unstickItem({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'DELETE', `/${itemId}/stick/`)
	}

	async changeOwner({ itemId, username, secretAnswer }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/change-owner/`, {
			username,
			secret_answer: secretAnswer
		})
	}

	async steamValue({ link, appId, currency, ignoreCache }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/steam-value/`, {
			link, app_id: appId, currency, ignore_cache: ignoreCache ? 1 : 0
		})
	}

	async steamPreview({ itemId, type }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/steam-preview/`, { type })
	}

	async getCategoryParams({ categoryName }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${categoryName}/params/`)
	}

	async getGames({ categoryName }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${categoryName}/games/`)
	}

	async bumpItem({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/bump/`)
	}

	async getCategories({ topQueries }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/category/`, { top_queries: topQueries ? 1 : 0 })
	}

	async getMe(): Promise<any> {
		return await this.caller.call('market', 'GET', `/me/`)
	}

	async editMe({ disableSteamGuard, userAllowAskDiscount, maxDiscountPercent, allowAcceptAccounts, hideFavorites, vkUa }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'PUT', `/me/`, {
			disable_steam_guard: disableSteamGuard,
			user_allow_ask_discount: userAllowAskDiscount,
			max_discount_percent: maxDiscountPercent,
			allow_accept_accounts: allowAcceptAccounts,
			hide_favorites: hideFavorites,
			vk_ua: vkUa
		})
	}

	async getProxys(): Promise<any> {
		return await this.caller.call('market', 'GET', `/proxy/`)
	}

	async addProxy({ proxyIP, proxyPort, proxyLogin, proxyPassword, proxyRow }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/proxy/`, {
			proxy_ip: proxyIP,
			proxy_port: proxyPort,
			proxy_user: proxyLogin,
			proxy_pass: proxyPassword,
			proxy_row: proxyRow
		})
	}

	async deleteProxy({ proxyId, deleteAll }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'DELETE', `/proxy/`, {
			proxy_id: proxyId,
			delete_all: deleteAll ? 1 : 0
		})
	}

	async fastSell({
		title, titleEn,
		price, categoryId,
		currency, itemOrigin,
		extendedGuarantee,
		description, information,
		login, password, loginPassword,
		hasEmailLoginData, EmailLoginData,
		closeItem, emailType, allowAskDiscount,
		proxyId, randomProxy, extraData
	}: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/item/fast-sell`, {
			title, title_en: titleEn,
			price, category_id: categoryId,
			currency, item_origin: itemOrigin,
			extended_guarantee: extendedGuarantee,
			description, information,
			login, password, login_password: loginPassword,
			has_email_login_data: hasEmailLoginData,
			email_login_data: EmailLoginData,
			close_item: closeItem,
			email_type: emailType,
			allow_ask_discount: allowAskDiscount,
			proxy_id: proxyId,
			random_proxy: randomProxy,
			extra: extraData
		})
	}

	async getAuction({ itemId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'GET', `/${itemId}/auction`)
	}

	async addBid({ itemId, currency, amount }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'POST', `/${itemId}/auction/bid`, {
			currency,
			amount
		})
	}

	async removeBid({ itemId, bidId }: Record<string, any> = {}): Promise<any> {
		return await this.caller.call('market', 'DELETE', `/${itemId}/auction/bid`, {
			bid_id: bidId
		})
	}
}
