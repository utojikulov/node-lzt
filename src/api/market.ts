import { LZTApiGroup } from "../apiGroup.js"
import { LZTApiError } from "../errors.js"
import type {
    SearchParams,
    SearchResponse,
    GetUserResponse,
    GetUserItemsParams,
    GetPaymentsParams,
    GetOrdersParams,
    FastBuyParams,
    TransferParams,
    AddItemParams,
    FastSellParams,
    AddProxyParams,
    DeleteProxyParams,
    EditItemParams,
    GetItemParams,
    ReserveParams,
    CancelReserveParams,
    CheckAccountParams,
    ConfirmBuyParams,
    TagParams,
    DeleteItemParams,
    GetMafileParams,
    GetGuardCodeParams,
    GetTelegramCodeParams,
    ResetTelegramAuthParams,
    GetTempEmailPasswordParams,
    FaveParams,
    StickParams,
    ChangeOwnerParams,
    SteamValueParams,
    SteamPreviewParams,
    GetCategoryParamsParams,
    GetGamesParams,
    BumpItemParams,
    GetCategoriesParams,
    EditMeParams,
    AddBidParams,
    RemoveBidParams,
    GetAuctionParams,
    GetNotPublishedItemParams,
    CheckItemParams,
    GetEmailCodeParams,
    RefuseGuaranteeParams,
    ChangePasswordParams,
    MarketResponse
} from '../types/index.js'

export class LZTApiMarketGroup extends LZTApiGroup {
    static readonly apiName = "market"

    #userId: number | null = null

    async #getMyUserId(): Promise<number> {
        if (!this.#userId) await this.getUser()

        if (!this.#userId) throw new LZTApiError("Cannot get my userId")

        return this.#userId
    }

    async search(params?: SearchParams): Promise<SearchResponse> {
        if (!params) params = {}
        const { categoryName, ...rest } = params
        return await this.caller.call<SearchResponse>(
            "market",
            "GET",
            categoryName ? `/${categoryName}` : "/",
            {
                ...rest,
                showStickyItems: params.showStickyItems ? 1 : undefined,
            },
        )
    }

    async getUser(): Promise<GetUserResponse> {
        const resp = await this.caller.call<GetUserResponse>(
            "market",
            "GET",
            "/user",
        )

        if (!this.#userId && resp?.user?.user_id) this.#userId = resp.user.user_id

        return resp
    }

    async getUserItems(params?: GetUserItemsParams): Promise<SearchResponse> {
        if (!params) params = {}
        let { userId, ...rest } = params
        if (!userId) userId = await this.#getMyUserId()

        return await this.caller.call<SearchResponse>(
            "market",
            "GET",
            `/user/${userId}/items/`,
            {
                category_id: rest.categoryId,
                pmin: rest.pmin,
                pmax: rest.pmax,
                title: rest.title,
                ...rest,
            },
        )
    }

    async getPayments(params?: GetPaymentsParams): Promise<MarketResponse> {
        if (!params) params = {}
        let { userId, ...rest } = params
        if (!userId) userId = await this.#getMyUserId()

        return await this.caller.call("market", "GET", `/user/${userId}/payments`, {
            type: rest.type,
            pmin: rest.pmin,
            pmax: rest.pmax,
            receiver: rest.receiver,
            sender: rest.sender,
            startDate: rest.startDate,
            endDate: rest.endDate,
            wallet: rest.wallet,
            comment: rest.comment,
            is_hold: rest.isHold ? 1 : undefined,
        })
    }

    async getOrders(params?: GetOrdersParams): Promise<SearchResponse> {
        if (!params) params = {}
        let { userId, ...rest } = params
        if (!userId) userId = await this.#getMyUserId()

        return await this.caller.call<SearchResponse>(
            "market",
            "GET",
            `/user/${userId}/orders`,
            {
                category_id: rest.categoryId,
                pmin: rest.pmin,
                pmax: rest.pmax,
                title: rest.title,
                ...rest
            },
        )
    }

    async getFave(): Promise<SearchResponse> {
        return await this.caller.call<SearchResponse>("market", "GET", "/fave")
    }

    async getViewed(): Promise<SearchResponse> {
        return await this.caller.call<SearchResponse>("market", "GET", "/viewed")
    }

    async getItem(params?: GetItemParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "GET", `/${params.itemId}`)
    }

    async reserve(params?: ReserveParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/reserve`,
            { price: params.price },
        )
    }

    async cancelReserve(params?: CancelReserveParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/cancel-reserve`,
        )
    }

    async checkAccount(params?: CheckAccountParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/check-account`,
        )
    }

    async confirmBuy(params?: ConfirmBuyParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/confirm-buy`,
        )
    }

    async fastBuy(params?: FastBuyParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/fast-buy`,
            {
                buy_without_validation: params.skipValidation ? 1 : undefined,
                price: params.price,
            },
        )
    }

    async transfer(params?: TransferParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", "/balance/transfer/", {
            user_id: params.userId,
            username: params.username,
            amount: params.amount,
            currency: params.currency,
            secret_answer: params.secretAnswer,
            transfer_hold: params.holdLengthValue ? 1 : undefined,
            hold_length_value: params.holdLengthValue,
            hold_length_option: params.holdLengthOption,
        })
    }

    async addItem(params?: AddItemParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", "/item/add/", {
            title: params.title,
            title_en: params.title_en,
            price: params.price,
            category_id: params.category_id,
            currency: params.currency,
            item_origin: params.item_origin,
            description: params.description,
            information: params.information,
            has_email_login_data: params.has_email_login_data ? 1 : undefined,
            email_login_data: params.email_login_data,
            email_type: params.email_type,
            allow_ask_discount: params.allow_ask_discount,
        })
    }

    async getNotPublishedItem(
        params?: GetNotPublishedItemParams,
    ): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.itemId}/goods/add/`,
            {
                resell_item_id: params.resellItemId,
            },
        )
    }

    async checkItem(params?: CheckItemParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/goods/check`,
            {
                close_item: params.closeItem,
            },
        )
    }

    async getEmailCode(params?: GetEmailCodeParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.itemId}/email-code/`,
            {
                email: params.email,
            },
        )
    }

    async refuseGuarantee(
        params?: RefuseGuaranteeParams,
    ): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/refuse-guarantee`,
        )
    }

    async changePassword(params?: ChangePasswordParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/change-password`,
            {
                _cancel: params._cancel ? 1 : undefined,
            },
        )
    }

    async editItem(params?: EditItemParams): Promise<MarketResponse> {
        if (!params) params = {}
        const { itemId, currency, ...fields } = params
        const transformedParams: Record<string, unknown> = { currency }

        const transformField = (field: string): string =>
        field.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)

        for (const key of Object.keys(fields)) {
            const value = fields[key as keyof typeof fields]
            transformedParams[`key_values[${transformField(key)}]`] =
                typeof value === "boolean" ? (value ? 1 : undefined) : value
        }

        return await this.caller.call(
            "market",
            "POST",
            `/${itemId}/edit/`,
            transformedParams,
        )
    }

    async addTag(params?: TagParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", `/${params.itemId}/tag/`, {
            tag_id: params.tagId,
        })
    }

    async deleteTag(params?: TagParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "DELETE",
            `/${params.itemId}/tag/`,
            {
                tag_id: params.tagId,
            },
        )
    }

    async deleteItem(params?: DeleteItemParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "DELETE", `/${params.itemId}`, {
            reason: params.reason,
        })
    }

    async getMafile(params?: GetMafileParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "GET", `/${params.itemId}/mafile/`)
    }

    async getGuardCode(params?: GetGuardCodeParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.itemId}/guard-code/`,
        )
    }

    async getTelegramCode(
        params?: GetTelegramCodeParams,
    ): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.itemId}/telegram-login-code/`,
        )
    }

    async resetTelegramAuth(
        params?: ResetTelegramAuthParams,
    ): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/telegram-reset-authorizations/`,
        )
    }

    async getTempEmailPassword(
        params?: GetTempEmailPasswordParams,
    ): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.itemId}/temp-email-password/`,
        )
    }

    async fave(params?: FaveParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", `/${params.itemId}/star/`)
    }

    async unFave(params?: FaveParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "DELETE",
            `/${params.itemId}/star/`,
        )
    }

    async stickItem(params?: StickParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", `/${params.itemId}/stick/`)
    }

    async unstickItem(params?: StickParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "DELETE",
            `/${params.itemId}/stick/`,
        )
    }

    async changeOwner(params?: ChangeOwnerParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/change-owner/`,
            {
                username: params.username,
                secret_answer: params.secretAnswer,
            },
        )
    }

    async steamValue(params?: SteamValueParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "GET", `/steam-value/`, {
            link: params.link,
            app_id: params.appId,
            currency: params.currency,
            ignore_cache: params.ignoreCache ? 1 : 0,
        })
    }

    async steamPreview(params?: SteamPreviewParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.itemId}/steam-preview/`,
            {
                type: params.type,
            },
        )
    }

    async getCategoryParams(
        params?: GetCategoryParamsParams,
    ): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.categoryName}/params/`,
        )
    }

    async getGames(params?: GetGamesParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "GET",
            `/${params.categoryName}/games/`,
        )
    }

    async bumpItem(params?: BumpItemParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", `/${params.itemId}/bump/`)
    }

    async getCategories(params?: GetCategoriesParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "GET", `/category/`, {
            top_queries: params.topQueries ? 1 : 0,
        })
    }

    async getMe(): Promise<MarketResponse> {
        return await this.caller.call("market", "GET", `/me/`)
    }

    async editMe(params?: EditMeParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "PUT", `/me/`, {
            disable_steam_guard: params.disableSteamGuard,
            user_allow_ask_discount: params.userAllowAskDiscount,
            max_discount_percent: params.maxDiscountPercent,
            allow_accept_accounts: params.allowAcceptAccounts,
            hide_favorites: params.hideFavorites,
            vk_ua: params.vkUa,
        })
    }

    async getProxys(): Promise<MarketResponse> {
        return await this.caller.call("market", "GET", `/proxy/`)
    }

    async addProxy(params?: AddProxyParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", `/proxy/`, {
            proxy_ip: params.proxy_ip,
            proxy_port: params.proxy_port,
            proxy_user: params.proxy_user,
            proxy_pass: params.proxy_pass,
            proxy_row: params.proxy_row,
        })
    }

    async deleteProxy(params?: DeleteProxyParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "DELETE", `/proxy/`, {
            proxy_id: params.proxy_id,
            delete_all: params.delete_all ? 1 : 0,
        })
    }

    async fastSell(params?: FastSellParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "POST", `/item/fast-sell`, {
            title: params.title,
            title_en: params.title_en,
            price: params.price,
            category_id: params.category_id,
            currency: params.currency,
            item_origin: params.item_origin,
            extended_guarantee: params.extended_guarantee,
            description: params.description,
            information: params.information,
            login: params.login,
            password: params.password,
            login_password: params.login_password,
            has_email_login_data: params.has_email_login_data,
            email_login_data: params.email_login_data,
            close_item: params.close_item,
            email_type: params.email_type,
            allow_ask_discount: params.allow_ask_discount,
            proxy_id: params.proxy_id,
            random_proxy: params.random_proxy,
            extra: params.extra,
        })
    }

    async getAuction(params?: GetAuctionParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call("market", "GET", `/${params.itemId}/auction`)
    }

    async addBid(params?: AddBidParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "POST",
            `/${params.itemId}/auction/bid`,
            {
                currency: params.currency,
                amount: params.amount,
            },
        )
    }

    async removeBid(params?: RemoveBidParams): Promise<MarketResponse> {
        if (!params) params = {}
        return await this.caller.call(
            "market",
            "DELETE",
            `/${params.itemId}/auction/bid`,
            {
                bid_id: params.bidId,
            },
        )
    }
}
