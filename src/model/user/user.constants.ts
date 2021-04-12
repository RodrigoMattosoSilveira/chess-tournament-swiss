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

export const EMAIL_VALIDATION = {
	VALID: 0,
	INVALID: 1,
	ALREADY_EXISTS: 2
}

export const USER_DEFAULT_CONSTANTS = {
	PERMISSION: USER_PERMISSION.USER,
	RATING: 1000,
	RATING_STATE: USER_RATING_STATE.PROVISIONAL,
	STATE: USER_STATE.ACTIVE
}

