export interface SystemInfo {
	visitor_id: number
	time: number // unix
	log_id?: number // req log_id
}

export interface PaginationInfo {
	page: number
	perPage: number
	pages?: number
	totalItems?: number
	total?: number
	hasNextPage?: boolean
	searchUrl?: string
}

export interface PaginatedResponse<T> {
	items: T[]
	stickyItems?: T[]
	pagination: PaginationInfo
	system_info: SystemInfo
	[key: string]: unknown
}

export interface ApiResponse<T = Record<string, unknown>> {
	data?: T
	status?: 'success' | 'error' | 'pending'
	message?: string
	system_info?: SystemInfo
	pagination?: PaginationInfo
	[key: string]: unknown
}

export interface ErrorPayload {
	errors?: string[]
	error?: string
	error_description?: string
	system_info?: SystemInfo
	[key: string]: unknown
}
