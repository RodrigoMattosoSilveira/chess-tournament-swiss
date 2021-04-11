export const USER_RATING_STATE = {
	PROVISIONAL: "provisional",
	EFFECTIVE: "effective"
}

export const USER_STATE = {
	ACTIVE: "active",
	INACTIVE: "inactive"
}

export const USER_PERMISSION = {
	SYSTEM_ADMIN: "system_admin",
	TOURNAMENT_DIRECTOR: "tournament_director",
	USER: "user"
}

export const USER_CONSTANTS = {
	DEFAULT_PERMISSION: USER_PERMISSION.USER,
	DEFAULT_RATING: 1000,
	DEFAULT_RATING_STATE: USER_RATING_STATE.PROVISIONAL,
	DEFAULT_STATE: USER_STATE.ACTIVE
}
