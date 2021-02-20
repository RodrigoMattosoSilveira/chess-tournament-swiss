import {GAME_ATTRIBUTES} from "../game/game.constants";

export const ROUND_ATTRIBUTES = {
	"id":         { "required": false, "patchable": false, "doublePatchable": false},
	"tournament": { "required": true,  "patchable": false, "doublePatchable": false },
	"number":     { "required": true,  "patchable": false, "doublePatchable": false },
	"games":      { "required": false, "patchable": true, "doublePatchable": false },
	"state":      { "required": false, "patchable": true, "doublePatchable": true },	// scheduled* (when round starts, and when result is recorded)
	"started":    { "required": false, "patchable": true, "doublePatchable": false },		// NAN
	"ended":      { "required": false, "patchable": true, "doublePatchable": false },		// today's date*
};
export const ROUND_ATTRIBUTES_KEYS: Array<string> = Object.keys(ROUND_ATTRIBUTES);
// console.log("\Round Attribute ROUND_ATTRIBUTES_KEYS: " + JSON.stringify(ROUND_ATTRIBUTES_KEYS));
// @ts-ignore
export const ROUND_REQUIRED_ATTRIBUTES = ROUND_ATTRIBUTES_KEYS.filter(key => ROUND_ATTRIBUTES[key].required === true);
// console.log("\nRound Attribute REQUIRED_ROUND_ATTRIBUTES: " + JSON.stringify(ROUND_REQUIRED_ATTRIBUTES));
// @ts-ignore
export const ROUND_PATCHABLE_ATTRIBUTES = ROUND_ATTRIBUTES_KEYS.filter(key => ROUND_ATTRIBUTES[key].patchable === true);
// console.log("\nRound Attribute ROUND_PATCHABLE_ATTRIBUTES: " + JSON.stringify(ROUND_PATCHABLE_ATTRIBUTES));
// @ts-ignore
export const ROUND_DOUBLE_PATCHABLE_ATTRIBUTES = ROUND_ATTRIBUTES_KEYS.filter(key => ROUND_ATTRIBUTES[key].doublePatchable === true);
// console.log("\nRound Attribute ROUND_PATCHABLE_ATTRIBUTES: " + JSON.stringify(ROUND_PATCHABLE_ATTRIBUTES));

export const ROUND_STATE = {
	SCHEDULED: "scheduled",
	UNDERWAY: "underway",
	COMPLETE: "completed"
}
