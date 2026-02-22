import type { SystemInfo, ApiResponse, PaginatedResponse } from "./common.js"

export interface BumpSettings {
    canBumpItem: boolean
    canBumpItemGlobally: boolean
    shortErrorPhrase: string
    errorPhrase: string
}

export interface Seller {
    user_id: number
    username: string
    sold_items_count: number
    active_item_count: number
    restore_data: string
    restore_percents: number
    avatar_date: number
    is_banned: number
    display_style_group_id: number
}

export interface MarketItem {
    item_id: number
    item_state: string
    category_id: number
    published_date: number
    title: string
    description: string
    price: number
    update_stat_date: number
    refreshed_date: number
    title_en?: string
    rub_price: number
    price_currency: string
    nsb: number
    allow_ask_discount: number
    view_count: number
    is_sticky: number
    seller: Seller
}

export interface SearchResponse extends PaginatedResponse<MarketItem> {
    items: MarketItem[]
    stickyItems?: MarketItem[]
    totalItems: number
    hasNextPage: boolean
    perPage: number
    page: number
    searchUrl: string
    system_info: SystemInfo
}

export interface MarketUser {
    user_id: number
    username: string
    balance: string
    currency: string
    bump_item_period: number
    sold_items_count: number
    active_items_count: number
    is_banned: number
    joined_date: number
    last_activity: number
    register_date: number
}

export interface GetUserResponse extends ApiResponse<{ user: MarketUser }> {
    user: MarketUser
    system_info: SystemInfo
}

export type MarketResponse<T = Record<string, unknown>> = ApiResponse<T> & {
    system_info?: SystemInfo
    [key: string]: unknown
}

// params

export interface SearchParams {
    categoryName?: string | null
    pmin?: number
    pmax?: number
    title?: string
    showStickyItems?: boolean
    [key: string]: unknown
}

export interface GetUserItemsParams {
    userId?: number | null
    categoryId?: number
    pmin?: number
    pmax?: number
    title?: string
    [key: string]: unknown
}

export interface GetPaymentsParams {
    userId?: number | null
    type?: string
    pmin?: number
    pmax?: number
    receiver?: string
    sender?: string
    startDate?: string
    endDate?: string
    wallet?: string
    comment?: string
    isHold?: boolean
}

export interface GetOrdersParams {
    userId?: number | null
    categoryId?: number
    pmin?: number
    pmax?: number
    title?: string
    [key: string]: unknown
}

export interface FastBuyParams {
    itemId?: number | string
    price?: number
    skipValidation?: boolean
}

export interface TransferParams {
    userId?: number
    username?: string
    amount?: number
    currency?: string
    secretAnswer?: string
    holdLengthValue?: number
    holdLengthOption?: string
}

export interface AddItemParams {
    title?: string
    title_en?: string
    price?: number
    category_id?: number
    currency?: string
    item_origin?: string
    description?: string
    information?: string
    email_login_data?: string
    email_type?: string
    allow_ask_discount?: boolean
    has_email_login_data?: boolean
}

export interface FastSellParams {
    title?: string
    title_en?: string
    price?: number
    category_id?: number
    currency?: string
    item_origin?: string
    extended_guarantee?: boolean
    description?: string
    information?: string
    login?: string
    password?: string
    login_password?: string
    has_email_login_data?: boolean
    email_login_data?: string
    close_item?: boolean
    email_type?: string
    allow_ask_discount?: boolean
    proxy_id?: string | number
    random_proxy?: boolean
    extra?: Record<string, unknown>
}

export interface AddProxyParams {
    proxy_ip?: string
    proxy_port?: number
    proxy_user?: string
    proxy_pass?: string
    proxy_row?: number
}

export interface DeleteProxyParams {
    proxy_id?: string | number
    delete_all?: boolean
}

export interface EditItemParams {
    itemId?: number | string
    currency?: string
    [key: string]: unknown
}

export interface GetItemParams {
    itemId?: number | string
}

export interface ReserveParams {
    itemId?: number | string
    price?: number
}

export interface CancelReserveParams {
    itemId?: number | string
}

export interface CheckAccountParams {
    itemId?: number | string
}

export interface ConfirmBuyParams {
    itemId?: number | string
}

export interface TagParams {
    itemId?: number | string
    tagId?: number | string
}

export interface DeleteItemParams {
    itemId?: number | string
    reason?: string
}

export interface GetMafileParams {
    itemId?: number | string
}

export interface GetGuardCodeParams {
    itemId?: number | string
}

export interface GetTelegramCodeParams {
    itemId?: number | string
}

export interface ResetTelegramAuthParams {
    itemId?: number | string
}

export interface GetTempEmailPasswordParams {
    itemId?: number | string
}

export interface FaveParams {
    itemId?: number | string
}

export interface StickParams {
    itemId?: number | string
}

export interface ChangeOwnerParams {
    itemId?: number | string
    username?: string
    secretAnswer?: string
}

export interface SteamValueParams {
    link?: string
    appId?: number
    currency?: string
    ignoreCache?: boolean
}

export interface SteamPreviewParams {
    itemId?: number | string
    type?: string
}

export interface GetCategoryParamsParams {
    categoryName?: string
}

export interface GetGamesParams {
    categoryName?: string
}

export interface BumpItemParams {
    itemId?: number | string
}

export interface GetCategoriesParams {
    topQueries?: boolean
}

export interface EditMeParams {
    disableSteamGuard?: boolean
    userAllowAskDiscount?: boolean
    maxDiscountPercent?: number
    allowAcceptAccounts?: boolean
    hideFavorites?: boolean
    vkUa?: boolean
}

export interface AddBidParams {
    itemId?: number | string
    currency?: string
    amount?: number
}

export interface RemoveBidParams {
    itemId?: number | string
    bidId?: number | string
}

export interface GetAuctionParams {
    itemId?: number | string
}

export interface GetNotPublishedItemParams {
    itemId?: number | string
    resellItemId?: string | number
}

export interface CheckItemParams {
    itemId?: number | string
    closeItem?: boolean
}

export interface GetEmailCodeParams {
    itemId?: number | string
    email?: string
}

export interface RefuseGuaranteeParams {
    itemId?: number | string
}

export interface ChangePasswordParams {
    itemId?: number | string
    _cancel?: boolean
}
