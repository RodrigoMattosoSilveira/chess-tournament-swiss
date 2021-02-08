import express from 'express';

// todo: apply this generalization to all other entities
import service from './player.service';
import userService from './../user/user.service';
import tournamentService from './../tournament/tournament.service';
import {PLAYER_REQUIRED_ATTRIBUTES, player_states} from "../../contants/contants";

class PlayerMiddleware {
	private static instance: PlayerMiddleware;
	private entityName = "Player";
	
	static getInstance() {
		if (!PlayerMiddleware.instance) {
			PlayerMiddleware.instance = new PlayerMiddleware();
		}
		return PlayerMiddleware.instance;
	}
	
	async validateRequiredBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/body: ' + JSON.stringify(req.body) + '\n');
		let missingAttributes = "";
		if (req.body) {
			for (let i = 0; i < PLAYER_REQUIRED_ATTRIBUTES.length; i < i++) {
				let requiredAttribute = PLAYER_REQUIRED_ATTRIBUTES[i];
				// @ts-ignore
				if (!req[requiredAttribute]) {
					if (missingAttributes.length > 0) {
						missingAttributes += ', ';
					}
					missingAttributes += missingAttributes;
				}
			}
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/message: ' + missingAttributes + '\n');
				res.status(400).send({error: "Missing required tournament attributes: "} + missingAttributes);
			} else {
				// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/message: All required attributes present' + '\n');
				next()
			}
		} else {
			res.status(400).send({error: this.entityName + ` body is missing`});
		}
	}
	
	async validateExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'PlayerMiddleware/validateNameIsUnique : Name is unique' + '\n');
		const entity = await service.readById(req.params.id);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: this.entityName +  `id: ` + req.params.id + ` not found`});
		}
	}
	
	async validateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'PlayerMiddleware/validateUser : Name is unique' + '\n');
		const entity = await userService.readById(req.params.user);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: this.entityName + `user: ` + req.params.user + ` not found`});
		}
	}
	
	async validateTournament(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'PlayerMiddleware/validateTournament : Name is unique' + '\n');
		const entity = await tournamentService.readById(req.params.tournament);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: this.entityName + `tournament: ` + req.params.tournament + ` not found`});
		}
	}
	
	async validateStateIfPresent(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'PlayerMiddleware/validateStateIfPresent\n');
		// Validate type only if present
		if (!req.body.state) {
			// console.log('\n' + 'PlayerMiddleware/validateStateIfPresent: not present\n');
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'PlayerMiddleware/validateStateIfPresent:  ' + req.body.state + '\n');
			if (!isStateSupported(req.body.type)) {
				// console.log('\n' + 'PlayerMiddleware/validateStateIfPresent:  Invalid' + req.body.state + '\n');
				res.status(404).send({error: this.entityName + ` state: ` + req.params.state + `is invalid`});
			} else {
				// console.log('\n' + 'PlayerMiddleware/validateStateIfPresent:  Valid' + req.body.state + '\n');
				next();
			}
		}
		// console.log('\n' + 'PlayerMiddleware/validateStateIfPresent/state: ' + req.body.state + '\n');
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'PlayerMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
}
export default PlayerMiddleware.getInstance();

const isStateSupported = (state: string): boolean => {
	let requestState  = state.toLowerCase();
	// console.log('\n' + 'PlayerMiddleware/isStateSupported/type: ' + requestType + '\n');
	return player_states.findIndex((aValidState: string) => aValidState === requestState) !== -1;
}


