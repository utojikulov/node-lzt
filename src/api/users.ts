import { LZTApiGroup } from '../apiGroup.js'
import type {
	GetUsersParams,
	CreateUserParams,
	GetUserParams,
	EditUserParams,
	SetAvatarParams,
	DeleteAvatarParams,
	GetFollowersParams,
	FollowParams,
	UnfollowParams,
	GetFollowingsParams,
	IgnoreParams,
	UnignoreParams,
	GetUserGroupsParams,
	ForumUser,
	ForumResponse
} from '../types/index.js'

export class LZTApiUsersGroup extends LZTApiGroup {
	static readonly apiName = 'users'
	
	async getUsers(params?: GetUsersParams): Promise<ForumResponse> {
		return await this.caller.call('forum', 'GET', '/users', params ?? {})
	}
	
	async create(params?: CreateUserParams): Promise<ForumResponse> {
		if (!params) params = {}
		return await this.caller.call('forum', 'POST', '/users', {
			user_email: params.userEmail,
			username: params.username,
			password: params.password,
			password_algo: params.passwordAlgo,
			user_dob_day: params.userDobDay,
			user_dob_month: params.userDobMonth,
			user_dob_year: params.userDobYear,
			fields: params.fields,
			client_id: params.clientId,
			extra_data: params.extraData,
			extra_timestamp: params.extraTimestamp
		})
	}
	
	async getFields(): Promise<ForumResponse> {
		return await this.caller.call('forum', 'GET', '/users/fields')
	}
	
	async getUser(params?: GetUserParams): Promise<ForumUser> {
		const userId = params?.userId ?? 'me'
		return await this.caller.call('forum', 'GET', `/users/${userId}`)
	}
	
	async edit(params?: EditUserParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'PUT', `/users/${userId}`, {
			password: params.password,
			password_old: params.passwordOld,
			password_algo: params.passwordAlgo,
			user_email: params.userEmail,
			username: params.username, 
			user_title: params.userTitle,
			primary_group_id: params.primaryGroupId,
			secondary_group_ids: params.secondaryGroupIds,
			user_dob_day: params.userDobDay,
			user_dob_month: params.userDobMonth,
			user_dob_year: params.userDobYear,
			fields: params.fields
		})
	}
	
	async setAvatar(params?: SetAvatarParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'POST', `/users/${userId}/avatar`, { avatar: params.avatar })
	}
	
	async deleteAvatar(params?: DeleteAvatarParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'DELETE', `/users/${userId}/avatar`)
	}
	
	async getFollowers(params?: GetFollowersParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'GET', `/users/${userId}/followers`, { 
			order: params.order, 
			page: params.page, 
			limit: params.limit 
		})
	}
	
	async follow(params?: FollowParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'POST', `/users/${userId}/followers`)
	}
	
	async unfollow(params?: UnfollowParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'DELETE', `/users/${userId}/followers`)
	}
	
	async getFollowings(params?: GetFollowingsParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'GET', `/users/${userId}/followings`, { 
			order: params.order, 
			page: params.page, 
			limit: params.limit 
		})
	}
	
	async getIgnored(): Promise<ForumResponse> {
		return await this.caller.call('forum', 'GET', '/users/ignored')
	}
	
	async ignore(params?: IgnoreParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'POST', `/users/${userId}/ignore`)
	}
	
	async unignore(params?: UnignoreParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'DELETE', `/users/${userId}/ignore`)
	}
	
	async getGroups(): Promise<ForumResponse> {
		return await this.caller.call('forum', 'GET', '/users/groups')
	}
	
	async getUserGroups(params?: GetUserGroupsParams): Promise<ForumResponse> {
		if (!params) params = {}
		const userId = params.userId ?? 'me'
		return await this.caller.call('forum', 'GET', `/users/${userId}/groups`)
	}
}
