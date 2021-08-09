import express from 'express';

// todo: apply this generalization to all other entities
import service from './round.service';
import tournamentService from "../tournament/tournament.service";
import {
	ROUND_DOUBLE_PATCHABLE_ATTRIBUTES,
	ROUND_PATCHABLE_ATTRIBUTES,
	ROUND_REQUIRED_ATTRIBUTES, ROUND_STATE,
	round_states
} from "./round.constants";
import {RoundDto} from "./round.model";

class RoundMiddleware {
	private static instance: RoundMiddleware;
	
	static getInstance() {
		if (!RoundMiddleware.instance) {
			RoundMiddleware.instance = new RoundMiddleware();
		}
		return RoundMiddleware.instance;
	}
	
	async validateRequiredBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'RoundMiddleware/validateRequiredBodyFields/body: ' + JSON.stringify(req.body) + '\n');
		let missingAttributes = "";
		if (req.body) {
			for (let i = 0; i < ROUND_REQUIRED_ATTRIBUTES.length; i < i++) {
				let requiredAttribute = ROUND_REQUIRED_ATTRIBUTES[i];
				// @ts-ignore
				if (!req[requiredAttribute]) {
					if (missingAttributes.length > 0) {
						missingAttributes += ', ';
					}
					missingAttributes += missingAttributes;
				}
			}
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'RoundMiddleware/validateRequiredBodyFields/message: ' + missingAttributes + '\n');
				res.status(400).send({error: "CREATE round  missing required attributes: "} + missingAttributes);
			} else {
				// console.log('\n' + 'RoundMiddleware/validateRequiredBodyFields/message: All required attributes present' + '\n');
				next()
			}
		} else {
			res.status(400).send({error: `Round body is missing`});
		}
	}
	
	async validateTournamentExist(req: express.Request, res: express.Response, next: express.NextFunction) {
		const tournament = await tournamentService.readByEid(req.body.tournament);
		if (!tournament) {
			// console.log('\n' + 'RoundMiddleware/validateTournamentExist/message: tournament does not exist' + req.body.tournament + '\n');
			res.status(400).send({error: `CREATE round tournament must exist: ` + req.body.tournament});
		} else {
			// console.log('\n' + 'RoundMiddleware/validateTournamentExist/message: tournament exists' + req.body.tournament + '\n');
			next();
		}
	}
	
	async validateExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'RoundMiddleware/validateExists: ' + req.params.id + '\n');
		const entity = await service.readById(req.params.id);
		if (entity) {
			// console.log('\n' + 'RoundMiddleware/validateExists: found it' + '\n');
			next();
		} else {
			// console.log('\n' + 'RoundMiddleware/validateExists: did not find it' + '\n');
			res.status(400).send({error: `entity ${req.params.id} not found`});
		}
	}
	
	async setRoundNumber(req: express.Request, res: express.Response, next: express.NextFunction) {
		let rounds: Array<RoundDto> = await service.list();
		if (rounds.length === 0) {
			req.body.number = 1;
		} else {
			let highestRoundNumber = 0;
			for (let round in rounds) {
				// @ts-ignore
				let roundNumber = round['number'];
				if (roundNumber > highestRoundNumber) {
					highestRoundNumber = roundNumber;
				}
			}
			req.body.number = highestRoundNumber + 1;
		}
		next();
	}
	
	async validatePatchFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log(`RoundMiddleware.patchById.id: ` + req.params.id)
		// console.log(`RoundMiddleware.patchById.collection: ` + JSON.stringify(req.body))
		const currentEntity = await service.readById(req.params.id);
		for (let field of ROUND_PATCHABLE_ATTRIBUTES) {
			if (field in req.body) {
				// @ts-ignore
				if (!(field in currentEntity)) {
					next();
				} else {
					if (ROUND_DOUBLE_PATCHABLE_ATTRIBUTES.findIndex((attribute: string) => attribute === field) !== -1) {
						next();
					}
					else {
						res.status(400).send({error: `PATCH round attribute already se and and cannot be reset: ` + field});
					}
				}
			}
		}
	}
	
	async validateState(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'RoundMiddleware/validateState\n');
		// Validate type only if present
		if (!req.body.state) {
			// console.log('\n' + 'RoundMiddleware/validateState: not present\n');
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'RoundMiddleware/validateState:  ' + req.body.state + '\n');
			if (!isStateSupported(req.body.state)) {
				// console.log('\n' + 'RoundMiddleware/validateState:  Invalid' + req.body.state + '\n');
				res.status(400).send({error: `PATCH round state attribute is invalid: ` + req.body.state});
			} else {
				// console.log('\n' + 'RoundMiddleware/validateState:  Valid' + req.body.state + '\n');
				// set the started or ended dates
				switch (req.body.state) {
					case ROUND_STATE.UNDERWAY:
						req.body.started = Date.now();
						break;
					case ROUND_STATE.COMPLETE:
						req.body.completed = Date.now();
						break;
					default:
						res.status(400).send({error: `PATCH round state attribute is invalid: ` + req.body.state});
				}
				next();
			}
		}
		// console.log('\n' + 'RoundMiddleware/validateState/state: ' + req.body.state + '\n');
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'RoundMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
}

export default RoundMiddleware.getInstance();

const isStateSupported = (state: string): boolean => {
	let requestState  = state.toLowerCase();
	// console.log('\n' + 'RoundMiddleware/isStateSupported/type: ' + requestType + '\n');
	return round_states.findIndex((aValidState: string) => aValidState === requestState) !== -1;
}

/**
 * Returns true is points is numberic, false otherwise
 * @param points
 * @return boolean
 */
const isStringNumeric = (points: string): boolean => {
	return !isNaN(Number(points))
}
