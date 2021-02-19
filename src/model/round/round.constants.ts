import {GAME_ATTRIBUTES} from "../game/game.constants";

export const ROUND_ATTRIBUTES = {
	"id":         { "required": false, "patchable": false },
	"tournament": { "required": true,  "patchable": false },
	"number":     { "required": true,  "patchable": false },
	"games":      { "required": false, "patchable": true },
	"state":      { "required": false, "patchable": true },	// scheduled* (when round starts, and when result is recorded)
	"start":      { "required": false, "patchable": true },		// NAN
	"end":        { "required": false, "patchable": true },		// today's date*
};
export const ROUND_ATTRIBUTES_KEYS: Array<string> = Object.keys(ROUND_ATTRIBUTES);
// console.log("\Round Attribute ROUND_ATTRIBUTES_KEYS: " + JSON.stringify(ROUND_ATTRIBUTES_KEYS));
// @ts-ignore
export const ROUND_REQUIRED_ATTRIBUTES = ROUND_ATTRIBUTES_KEYS.filter(key => ROUND_ATTRIBUTES[key].required === true);
// console.log("\nRound Attribute REQUIRED_ROUND_ATTRIBUTES: " + JSON.stringify(ROUND_REQUIRED_ATTRIBUTES));
// @ts-ignore
export const ROUND_PATCHABLE_ATTRIBUTES = ROUND_ATTRIBUTES_KEYS.filter(key => ROUND_ATTRIBUTES[key].patchable === true);
// console.log("\nRound Attribute ROUND_PATCHABLE_ATTRIBUTES: " + JSON.stringify(ROUND_PATCHABLE_ATTRIBUTES));

export const ROUND_STATE = {
	SCHEDULED: "scheduled",
	UNDERWAY: "underway",
	COMPLETE: "completed"
}
