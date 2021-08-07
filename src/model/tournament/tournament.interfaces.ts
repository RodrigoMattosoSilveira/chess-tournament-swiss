import { keys } from 'ts-transformer-keys';
/**
 *  The Tournament Data Object
 */
export interface ITournamentDto {
	eid: string;						// created by the controller
	name: string;					// Must be unique and at least 15 characters long
	city?: string;          		// Must be in the cities table;
	country?: string;       		// Must be in the countries table;
	year?: number;          		// Must be in the cities table;
	rounds?: number;        			// Must be a number less than 25;
	maxPlayers?: number;				// Must be a number less than 129;
	minRate?: number;        		// Must be a positive number;
	maxRate?: number;        		// Must be a positive number;
	type?: string; 					// Must be a TOURNAMENT_TYPE;
	players?: string[]; 				// Must be empty to start
	state?: string; 					// Must be a TOURNAMENT_STATE;
	winPoints?: number;     			// Must be a positive number; default is 1
	tiePoints?: number; 				// Must be a positive number; default is 0.5
	scheduledStartDate?: number; 	// milliseconds since epoch to date
	scheduledEndDate?: number; 		// milliseconds since epoch to date
	actualStartDate?: number; 		// milliseconds since epoch to date
	actualEndDate?: number; 		// milliseconds since epoch to date
}
export const TOURNAMENT_DTO_KEYS = keys<ITournamentDto>();

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
	city?: string;          		// Must be in the cities table;
	country?: string;       		// Must be in the countries table;
	year?: number;          		// Must be in the cities table;
	rounds?: number;        			// Must be a number less than 25;
	maxPlayers?: number;				// Must be a number less than 129;
	minRate?: number;        		// Must be a positive number;
	maxRate?: number;        		// Must be a positive number;
	type?: string; 					// Must be a TOURNAMENT_TYPE;
	players?: string[]; 				// Must be empty to start
	state?: string; 					// Must be a TOURNAMENT_STATE;
	winPoints?: number;     			// Must be a positive number; default is 1
	tiePoints?: number; 				// Must be a positive number; default is 0.5
	scheduledStartDate?: number; 	// milliseconds since epoch to date
	scheduledEndDate?: number; 		// milliseconds since epoch to date
	actualStartDate?: number; 		// milliseconds since epoch to date
	actualEndDate?: number; 		// milliseconds since epoch to date
}
export const TOURNAMENT_CREATE_KEYS = keys<ITournamentCreate>();

/**
 *  The Data Object used when patching a Tournament
 *
 *  The PATCH API returns a TournamentDto for the updated entity;
 */
export interface ITournamentPatch {
	eid: string;						// created by the controller
	name?: string;					// Must be unique and at least 15 characters long
	city?: string;          		// Must be in the cities table;
	country?: string;       		// Must be in the countries table;
	year?: number;          		// Must be in the cities table;
	rounds?: number;        			// Must be a number less than 25;
	maxPlayers?: number;				// Must be a number less than 129;
	minRate?: number;        		// Must be a positive number;
	maxRate?: number;        		// Must be a positive number;
	type?: string; 					// Must be a TOURNAMENT_TYPE;
	players?: string[]; 				// Must be empty to start
	state?: string; 					// Must be a TOURNAMENT_STATE;
	winPoints?: number;     			// Must be a positive number; default is 1
	tiePoints?: number; 				// Must be a positive number; default is 0.5
	scheduledStartDate?: number; 	// milliseconds since epoch to date
	scheduledEndDate?: number; 		// milliseconds since epoch to date
	actualStartDate?: number; 		// milliseconds since epoch to date
	actualEndDate?: number; 		// milliseconds since epoch to date
}
export const TOURNAMENT_PATCH_KEYS = keys<ITournamentPatch>();