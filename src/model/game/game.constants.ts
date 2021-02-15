import {TOURNAMENT_STATE, tournament_states} from "../../contants/contants";

/**
	Model
		id: string, // unique game id
		tournament: string, // unique tournament id
		white: string, // unique player id, must differ from black
		black: string, // unique player id, must differ from white
		state: string, // unique state id (scheduled/underway/complete)
		result: Array<number>, // NAN, created when the game completes
		date: string,  // a valid game date
 */
export const GAME_ATTRIBUTES = {
	"id":         { "required": false, "patchable": true },
	"tournament": { "required": true, "patchable": false },
	"white":      { "required": true, "patchable": false },
	"black":      { "required": true, "patchable": false },
	"state":      { "required": false, "patchable": true },	// scheduled* (when round starts, and when result is recorded)
	"result":     { "required": false, "patchable": true },		// NAN
	"date":       { "required": false, "patchable": true },		// today's date*
};
export const GAME_ATTRIBUTES_KEYS: Array<string> = Object.keys(GAME_ATTRIBUTES);
// console.log("\nGame Attribute GAME_ATTRIBUTES_KEYS: " + JSON.stringify(GAME_ATTRIBUTES_KEYS));
// @ts-ignore
export const REQUIRED_GAME_ATTRIBUTES = GAME_ATTRIBUTES_KEYS.filter(key => GAME_ATTRIBUTES[key].required === true);
// console.log("\nGame Attribute REQUIRED_GAME_ATTRIBUTES: " + JSON.stringify(REQUIRED_GAME_ATTRIBUTES));
// @ts-ignore
export const PATCHABLE_GAME_ATTRIBUTES = GAME_ATTRIBUTES_KEYS.filter(key => GAME_ATTRIBUTES[key].patchable === true);
// console.log("\nGame Attribute PATCHABLE_GAME_ATTRIBUTES: " + JSON.stringify(PATCHABLE_GAME_ATTRIBUTES));

export const GAME_STATES = {
	SCHEDULED: "scheduled",
	UNDERWAY: "underway",
	COMPLETE: "completed"
}
export const game_states = []
Object.keys(GAME_STATES).forEach(key => {// @ts-ignore
	game_states.push(GAME_STATES[key])})

export const GAME_RESULTS = {
	WHITE_RESIGNED: "0-1",
	WHITE_ACCEPTED_DRAW: "1/2-1/2",
	WHITE_FORFEITED: "0-f",
	BLACK_RESIGNED: "1-0",
	BLACK_ACCEPTED_DRAW: "1/2-1/2",
	BLACK_FORFEITED: "f-0",
}
export const GAME_RESULTS_KEYS: Array<string> = Object.keys(GAME_RESULTS);
export const game_results = []
Object.keys(GAME_RESULTS).forEach(key => {// @ts-ignore
	game_results.push(GAME_RESULTS[key])})

export const valid_game_results = [-1, 0, 1];
