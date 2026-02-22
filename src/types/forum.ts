import type { SystemInfo, ApiResponse } from './common.js'

export interface ForumCategory {
    category_id: number
    category_title: string
    category_description: string
    links: {
        permalink: string
        detail: string
        'sub-categories': string
        'sub-forums': string
    }
    permissions: {
        view: boolean
        edit: boolean
        delete: boolean
    }
}

export interface GetForumCategoriesResponse extends ApiResponse<{ categories: ForumCategory[] }> {
    categories: ForumCategory[]
    categories_total: number
    system_info: SystemInfo
}

export interface ForumUser {
    user_id: number
    username: string
    user_email?: string
    user_register_date: number
    short_link: string
    user_title?: string
    is_banned: number
    [key: string]: unknown
}

export interface GetForumUserResponse extends ForumUser {
    system_info?: SystemInfo
}

export interface UserFields {
    [key: string]: unknown
}

export type ForumResponse<T = Record<string, unknown>> = ApiResponse<T> & {
    system_info?: SystemInfo
    [key: string]: unknown
}

// param types

export interface GetForumCategoriesParams {
        parent_category_id?: number
        parent_forum_id?: number
        order?: string
}

export interface GetUsersParams {
    page?: number
    limit?: number
    [key: string]: unknown
}

export interface CreateUserParams {
    userEmail?: string
    username?: string
    password?: string
    passwordAlgo?: string
    userDobDay?: number
    userDobMonth?: number
    userDobYear?: number
    fields?: Record<string, unknown>
    clientId?: string
    extraData?: Record<string, unknown>
    extraTimestamp?: string
    [key: string]: unknown
}

export interface EditUserParams {
    userId?: string | 'me'
    fields?: Record<string, unknown>
    password?: string
    passwordOld?: string
    passwordAlgo?: string
    userEmail?: string
    username?: string
    userTitle?: string
    primaryGroupId?: number
    secondaryGroupIds?: number[]
    userDobDay?: number
    userDobMonth?: number
    userDobYear?: number
}

export interface GetUserParams {
    userId?: string | 'me'
}

// todo buffer usage should be applied
export interface SetAvatarParams {
    userId?: string | 'me'
    avatar?: unknown
}

export interface DeleteAvatarParams {
    userId?: string | 'me'
}

export interface GetFollowersParams {
    userId?: string | 'me'
    order?: string
    page?: number
    limit?: number
}

export interface FollowParams {
    userId?: string | 'me'
}

export interface UnfollowParams {
    userId?: string | 'me'
}

export interface GetFollowingsParams {
    userId?: string | 'me'
    order?: string
    page?: number
    limit?: number
}

export interface IgnoreParams {
    userId?: string | 'me'
}

export interface UnignoreParams {
    userId?: string | 'me'
}

export interface GetUserGroupsParams {
    userId?: string | 'me'
}
