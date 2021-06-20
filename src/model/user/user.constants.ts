export const USER_RATING_STATE = {
	PROVISIONAL: "provisional",
	EFFECTIVE: "effective"
}

export const USER_STATE = {
	ACTIVE: "active",
	INACTIVE: "inactive"
}

export const USER_ROLE = {
	SYSTEM_ADMIN: "SYSTEM_ADMIN",
	TOURNAMENT_DIRECTOR: "TOURNAMENT_DIRECTOR",
	USER: "USER"
}

export const EMAIL_VALIDATION = {
	VALID: 0,
	INVALID: 1,
	ALREADY_EXISTS: 2
}

export const USER_DEFAULT_CONSTANTS = {
	ROLE: USER_ROLE.USER,
	RATING: 1000,
	RATING_STATE: USER_RATING_STATE.PROVISIONAL,
	STATE: USER_STATE.ACTIVE
}

export const USER_RATING = {
	MINIMUM: 500,
	MAXIMUM: 3000
}

export const USER_SHOW_ATTRIBUTES = `email firstName id lastName rating ratingState role state`

