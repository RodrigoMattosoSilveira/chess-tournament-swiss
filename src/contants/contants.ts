const COLOR = {
	WHITE: "white",
	BLACK: "black",
}
export { COLOR }

const SCORE = {
	WIN: 1,
	TIE: 0.5,
	LOSS: 0
}
export { SCORE }

const USER_STATE = {
	ACTIVE: "active",
	INACTIVE: "inactive"
}
export { USER_STATE }
export const user_states = []
Object.keys(USER_STATE).forEach(key => {// @ts-ignore
	user_states.push(USER_STATE[key])})

export const TOURNAMENT_VALID_ATTRIBUTES = ["name", "city", "country", "month", "year", "rounds", "maxPlayers", "type", "players", "state"];
export const TOURNAMENT_REQUIRED_ATTRIBUTES = ["name", "rounds", "maxPlayers", "type"];

const TOURNAMENT_STATE = {
	PLANNED: "planned",
	SCHEDULED: "scheduled",
	CLOSED: "closed",
	UNDERWAY: "underway",
	COMPLETE: "complete"
}
export { TOURNAMENT_STATE }
export const tournament_states = []
Object.keys(TOURNAMENT_STATE).forEach(key => {// @ts-ignore
	tournament_states.push(TOURNAMENT_STATE[key])})

const TOURNAMENT_TYPE = {
	ROUND_ROBIN: "round_robin",
	SWISS: "swiss",
	MATCH: "match",
	ELIMINATION: "elimination"
}
export { TOURNAMENT_TYPE }
export const tournament_types = []
Object.keys(TOURNAMENT_TYPE).forEach(key => {// @ts-ignore
	tournament_types.push(TOURNAMENT_TYPE[key])})



