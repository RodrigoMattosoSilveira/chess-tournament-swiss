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

export const TOURNAMENT_VALID_ATTRIBUTES     = ["name", "rounds", "maxPlayers", "type", "city", "country", "month", "year", "players", "state", "winPoints", "tiePoints", "stated", "ended"];
export const TOURNAMENT_REQUIRED_ATTRIBUTES  = ["name", "rounds", "maxPlayers", "type"];
export const TOURNAMENT_PATCHABLE_ATTRIBUTES = ["name", "city", "country", "month", "year", "rounds", "maxPlayers", "type", "players", "state", "winPoints", "tiePoints", "stated", "ended"];

const TOURNAMENT_STATE = {
	SCHEDULED: "scheduled",
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

export const PLAYER_VALID_ATTRIBUTES = ["user", "tournament", "hadByeOrForfeit", "byeNextRound", "playedAgainst", "playedColor", "results", "state"];
export const PLAYER_PATCHABLE_ATTRIBUTES = ["hadByeOrForfeit", "byeNextRound", "playedAgainst", "playedColor", "results", "state"];
export const PLAYER_REQUIRED_ATTRIBUTES = ["user", "tournament"];

const PLAYER_STATE = {
	ACTIVE: "active",
	INACTIVE: "inactive"
}
export { PLAYER_STATE }
export const player_states = []
Object.keys(PLAYER_STATE).forEach(key => {// @ts-ignore
	player_states.push(PLAYER_STATE[key])})

export enum HttpResponseCode {
	// information responses
	continue = 100,
	switching_protocol= 101,
	processing = 102,
	early_hints = 103,

	//	Successful responses
	ok = 200,
	created = 201,
	accepted = 202,
	non_authoritative_information = 203,
	no_content = 204,
	reset_content = 205,
	partial_content = 206,
	multi_status = 207,
	already_reported = 208,
	im_used = 226,

	//	Redirection messages
	multiple_choice = 300,
	moved_permanently = 301,
	found = 302,
	see_other = 303,
	not_modified = 304,
	use_proxy = 305,
	unused = 306,
	temporary_redirect = 307,
	permanent_redirect = 308,

	//	Client error responses
	bad_request = 400,
	unauthorized = 401,
	payment_required = 402,
	forbidden = 403,
	not_found = 404,
	method_not_allowed = 405,
	not_acceptable = 406,
	request_timeout = 408,
	conflict = 409,
	gone = 410,
	length_required = 411,
	precondition_failed = 412,
	payload_too_large = 413,
	uri_too_long = 414,
	unsupported_media_type = 415,
	range_not_satisfiable = 416,
	expectation_failed = 417,
	im_a_teapot = 418,
	misdirected_request = 421,
	unprocessable_entity = 422,
	locked = 423,
	failed_dependency = 424,
	too_early = 425,
	upgrade_required = 426,
	precondition_required = 428,
	too_many_requests = 429,
	request_header_fields_too_large = 431,
	unavailable_for_legal_reasons = 451,

	// Server error responses
	internal_server_error = 500,
	not_implemented_2 = 501,
	bad_gateway = 502,
	service_unavailable = 503,
	gateway_timeout = 504,
	http_version_not_supported = 505,
	variant_also_negotiates = 506,
	insufficient_storage = 507,
	loop_detected = 508,
	not_extended = 510,
	network_authentication_required = 511,
}