import {TOURNAMENT_STATE, tournament_states} from "../../contants/contants";

/**
	Model
		id: string, // unique game id
		tournament: string, // unique tournament id
		white: string, // unique player id, must differ from black
		black: string, // unique player id, must differ from white
		state: string, // unique state id (scheduled/underway/complete)
		result: Array<number>, // [x, y, z]
		date: string,  // a valid game date
 */
export const ATTRIBUTES = {
	"tournament": { "required": true, "patchable": false },
	"white":      { "required": true, "patchable": false },
	"black":      { "required": true, "patchable": false },
	"state":      { "required": false, "patchable": true },  // scheduled*
	"result":     { "required": false, "patchable": true },  // []*
	"date":       { "required": false, "patchable": true }, // today's date*
};
export const KEYS: Array<string> = Object.keys(ATTRIBUTES);
// console.log("\nGame Attribute KEYS: " + JSON.stringify(KEYS));
// @ts-ignore
export const REQUIRED_ATTRIBUTES = KEYS.filter(key => ATTRIBUTES[key].required === true);
// console.log("\nGame Attribute REQUIRED_ATTRIBUTES: " + JSON.stringify(REQUIRED_ATTRIBUTES));
// @ts-ignore
export const PATCHABLE_ATTRIBUTES = KEYS.filter(key => ATTRIBUTES[key].patchable === true);
// console.log("\nGame Attribute PATCHABLE_ATTRIBUTES: " + JSON.stringify(PATCHABLE_ATTRIBUTES));

export const STATES = {
	SCHEDULED: "scheduled",
	UNDERWAY: "underway",
	COMPLETE: "completed",
	INACTIVE: "inactive"
}
export const states = []
Object.keys(STATES).forEach(key => {// @ts-ignore
	states.push(STATES[key])})

export const valid_results = [-1, 0, 1];
