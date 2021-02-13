import express from 'express';

// todo: apply this generalization to all other entities
import service from './tournament.service';
import tournamentService from "../tournament/tournament.service";
import {tournament_types, tournament_states, TOURNAMENT_REQUIRED_ATTRIBUTES} from "../../contants/contants";

class TournamentMiddleware {
	private static instance: TournamentMiddleware;
	
	static getInstance() {
		if (!TournamentMiddleware.instance) {
			TournamentMiddleware.instance = new TournamentMiddleware();
		}
		return TournamentMiddleware.instance;
	}
	
	async validateRequiredBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateRequiredBodyFields/body: ' + JSON.stringify(req.body) + '\n');
		let missingAttributes = "";
		if (req.body) {
			for (let i = 0; i < TOURNAMENT_REQUIRED_ATTRIBUTES.length; i < i++) {
				let requiredAttribute = TOURNAMENT_REQUIRED_ATTRIBUTES[i];
				// @ts-ignore
				if (!req[requiredAttribute]) {
					if (missingAttributes.length > 0) {
						missingAttributes += ', ';
					}
					missingAttributes += missingAttributes;
				}
			}
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'TournamentMiddleware/validateRequiredBodyFields/message: ' + missingAttributes + '\n');
				res.status(400).send({error: "Missing required tournament attributes: "} + missingAttributes);
			} else {
				// console.log('\n' + 'TournamentMiddleware/validateRequiredBodyFields/message: All required attributes present' + '\n');
				next()
			}
		} else {
			res.status(400).send({error: `Tournament body is missing`});
		}
	}
	
	async validateNameIsUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
		const tournament = await tournamentService.getByName(req.body.name);
		if (tournament) {
			// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique/message: Name already exists' + '\n');
			res.status(400).send({error: `Tournament name already exists: ` + req.body.name});
		} else {
			// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique/message: Name is unique' + '\n');
			next();
		}
	}

	async validateExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique : Name is unique' + '\n');
		const entity = await service.readById(req.params.id);
		if (entity) {
			next();
		} else {
			res.status(400).send({error: `entity ${req.params.id} not found`});
		}
	}
	
	async validateType(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateTypeIfPresent/type: ' + req.body.type + '\n');
		// Validate type only if present
		if (!req.body.type) {
			next()
		} else {
			// it is present, hence must be valid
			if (!isTypeSupported(req.body.type)) {
				res.status(400).send({error: `type ${req.params.type} is invalid`});
			}
			else {
				next();
			}
		}
	}
	
	async validateState(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateState\n');
		// Validate type only if present
		if (!req.body.state) {
			// console.log('\n' + 'TournamentMiddleware/validateState: not present\n');
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'TournamentMiddleware/validateState:  ' + req.body.state + '\n');
			if (!isStateSupported(req.body.state)) {
				// console.log('\n' + 'TournamentMiddleware/validateState:  Invalid' + req.body.state + '\n');
				res.status(400).send({error: `type ${req.params.type} is invalid`});
			} else {
				// console.log('\n' + 'TournamentMiddleware/validateState:  Valid' + req.body.state + '\n');
				next();
			}
		}
		// console.log('\n' + 'TournamentMiddleware/validateState/state: ' + req.body.state + '\n');
	}
	
	async validateWinPoints(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateWinPoints\n');
		// Validate type only if present
		if (!req.body.winPoints) {
			// console.log('\n' + 'TournamentMiddleware/validateWinPoints: not present\n');
			req.body.win = 1;
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'TournamentMiddleware/validateWinPoints:  ' + req.body.win + '\n');
			if (!isStringNumeric(req.body.winPoints)) {
				// console.log('\n' + 'TournamentMiddleware/validateWinPoints:  Invalid' + req.body.win + '\n');
				res.status(400).send({error: `TournamentMiddleware/validateWinPoints winPoints ${req.params.winPoints} is invalid`});
			} else {
				// console.log('\n' + 'TournamentMiddleware/validateWinPoints:  Valid' + req.body.win + '\n');
				next();
			}
		}
	}
	
	async validateTiePoints(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateTiePoints\n');
		// Validate type only if present
		if (!req.body.tiePoints) {
			// console.log('\n' + 'TournamentMiddleware/validateTiePoints: not present\n');
			req.body.tiePoints = 1;
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'TournamentMiddleware/validateTiePoints:  ' + req.body.win + '\n');
			if (!isStringNumeric(req.body.tiePoints)) {
				// console.log('\n' + 'TournamentMiddleware/validateTiePoints:  Invalid' + req.body.win + '\n');
				res.status(400).send({error: `TournamentMiddleware/validateTiePoints tiePoints ${req.params.tiePoints} is invalid`});
			} else {
				// console.log('\n' + 'TournamentMiddleware/validateTiePoints:  Valid' + req.body.win + '\n');
				next();
			}
		}
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
}

export default TournamentMiddleware.getInstance();

/**
 * Asserts whether type is a supported tournament type
 * @param type
 * @return -1 if type is not a supported tournament type, non-negative value if so.
 */
const isTypeSupported = (type: string): boolean => {
	let requestType  = type.toLowerCase();
	// console.log('\n' + 'TournamentMiddleware/isTypeSupported/type: ' + requestType + '\n');
	return tournament_types.findIndex((aValidType: string) => aValidType === requestType) !== -1;
}

const isStateSupported = (state: string): boolean => {
	let requestState  = state.toLowerCase();
	// console.log('\n' + 'TournamentMiddleware/isStateSupported/type: ' + requestType + '\n');
	return tournament_states.findIndex((aValidState: string) => aValidState === requestState) !== -1;
}

/**
 * Returns true is points is numberic, false otherwise
 * @param points
 * @return boolean
 */
const isStringNumeric = (points: string): boolean => {
	return !isNaN(Number(points))
}
