import { keys } from 'ts-transformer-keys';
/**
 *  The Tournament Data Object
 */
export interface TournamentDto {
	id: string;						// created by the controller
	name: string;					// Must be unique and at least 15 characters long
	city?: string;          		// Must be in the cities table;
	country?: string;       		// Must be in the countries table;
	rounds: number;        			// Must be a number less than 25;
	maxPlayers: number;				// Must be a number less than 129;
	minRate: number;        		// Must be a positive number;
	maxRate: number;        		// Must be a positive number;
	type: string; 					// Must be a TOURNAMENT_TYPE;
	players: Array<string>; 		//
	state: string; 					// Must be a TOURNAMENT_STATE;
	winPoints: number;     			// Must be a positive number; default is 1
	tiePoints: number; 				// Must be a positive number; default is 0.5
	scheduledStartDate?: number; 	// milliseconds since epoch to date
	scheduledEndDate?: number; 		// milliseconds since epoch to date
	actualStartDate?: number; 		// milliseconds since epoch to date
	actualEndDate?: number; 		// milliseconds since epoch to date
}
export const TOURNAMENT_DTO_KEYS = keys<TournamentDto>();

/**
 *  The Data Object used when creating a Tournament
 *
 *  The CREATE API returns a TournamentDto for the new entity;
 *
 *  Note that the controller creates the following defaults:
 *  - id: uses the shortid package to generate it;
 *  - state: TOURNAMENT_TYPE.PLANNED;
 *  - Add remaining default attributes, as required
 */
export interface ITournamentCreate {
	name: string;					// Must be unique and at least 15 characters long
	city?: string;          		// Must be in the cities table; Default is St. Louis, set by the controller
	country?: string;       		// Must be in the countries table; Default is US, set by the controller
	rounds?: number;        		// Must be a number less than 25; Default is 7, set by the controller
	maxPlayers?: number;			// Must be a number less than 1025; default is 128, set by the controller
	minRate?: number;        		// Must be a positive number; default is 0, set by the controller
	maxRate?: number;        		// Must be a positive number; default is MaxiMUM NUMBER, set by the controller
	type?: string; 					// Must be a TOURNAMENT_TYPE; default is swiss, set by the controller
	winPoints?: number;     		// Must be a positive number; default is 1, set by the controller
	tiePoints?: number; 			// Must be a positive number; default is 0.5, set by the controller
	scheduledStartDate?: string; 	// Must be a valid date;
	scheduledEndDate?: string; 		// Must be a valid date, younger than scheduledStartDate;
}
export const TOURNAMENT_CREATE_KEYS = keys<ITournamentCreate>();

/**
 *  The Data Object used when patching a Tournament
 *
 *  The PATCH API returns a TournamentDto for the updated entity;
 */
export interface ITournamentPatch {
	id: string;						// must exist in the database
	name: string;					// Must be unique and at least 15 characters long
	city?: string;          		// Must be in the cities table;
	country?: string;       		// Must be in the countries table;
	rounds?: number;        		// Must be a number less than 25;
	maxPlayers?: number;			// Must be a number less than 129;
	minRate: number;        		// Must be a positive number;
	maxRate: number;        		// Must be a positive number, greater than minRate; default is MaxiMUM NUMBER
	type?: string; 					// Must be a TOURNAMENT_TYPE;
	players?: Array<number>; 		// default is []
	state?: string; 				// Must be a TOURNAMENT_STATE;
	winPoints?: number;     		// Must be a positive number;
	tiePoints?: number; 			// Must be a positive number;
	scheduledStartDate?: number; 	// Must be a valid date;
	scheduledEndDate?: number; 		// Must be a valid date, younger than scheduledStartDate;
	actualStartDate?: string; 		// Must be a valid date; younger than scheduledStartDate;
	actualEndDate?: string; 		// Must be a valid date; younger than actualStartDate;
}
export const TOURNAMENT_PATCH_KEYS = keys<ITournamentPatch>();
