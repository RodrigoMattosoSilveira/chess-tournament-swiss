import express from 'express';

// todo: apply this generalization to all other entities
// import service from './game.service';
import {REQUIRED_ATTRIBUTES, states, valid_results} from "./game.constants";
import gameService from "./game.service";
import playerService from "../player/player.service";
import tournamentService from "../tournament/tournament.service";
import { isStringNumeric, isValidDate } from "../../utils/utils";

class GameMiddleware {
	private static instance: GameMiddleware;
	private fakeTournaments = ["1", "2", "3", "4", "5"]
	private fakePlayers = ["1", "2", "3", "4", "5"]
	
	static getInstance() {
		if (!GameMiddleware.instance) {
			GameMiddleware.instance = new GameMiddleware();
		}
		return GameMiddleware.instance;
	}
	
	async validateRequiredBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateRequiredBodyFields/body: ' + JSON.stringify(req.body) + '\n');
		let missingAttributes = "";
		if (req.body) {
			for (let i = 0; i < REQUIRED_ATTRIBUTES.length; i < i++) {
				let requiredAttribute = REQUIRED_ATTRIBUTES[i];
				// @ts-ignore
				if (!req[requiredAttribute]) {
					if (missingAttributes.length > 0) {
						missingAttributes += ', ';
					}
					missingAttributes += missingAttributes;
				}
			}
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'GameMiddleware/validateRequiredBodyFields/message: ' + missingAttributes + '\n');
				res.status(400).send({error: `Missing required game attributes: `} + missingAttributes);
			} else {
				// console.log('\n' + 'GameMiddleware/validateRequiredBodyFields/message: All required game attributes are present' + '\n');
				next()
			}
		} else {
			res.status(400).send({error: `Game body is missing`});
		}
	}
	
	async validateExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique : Game exists' + '\n');
		const entity = await gameService.readById(req.params.id);
		if (entity) {
			next();
		} else {
			res.status(400).send({error: `Game id not found: ` + req.params.id});
		}
	}
	
	async validateTournament(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateTournament' + '\n');
		const entity = await tournamentService.readById(req.params.tournament);
		if (entity) {
			next();
		} else {
			if (["1", "2", "3", "4", "5"].findIndex((fakePlayer: string) => fakePlayer === req.params.tournament) !== -1) {
				res.status(404).send({error: `Tournament not found: ` + req.params.tournament});
			} else {
				next();
			}
		}
	}
	
	async validateWhitePiecesPlayer(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateWhitePiecesPlayer' + '\n');
		const entity = await playerService.readById(req.params.whitePlayer);
		if (entity) {
			next();
		} else {
			if (["1", "2", "3", "4", "5"].findIndex((fakePlayer: string) => fakePlayer === req.params.whitePlayer) !== -1) {
				res.status(404).send({error: `Game white pieces player not found: ` + req.params.whitePlayer});
			} else {
				next();
			}
		}
	}
	
	async validateBlackPiecesPlayer(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateBlackPiecesPlayer : Player exists' + '\n');
		const entity = await playerService.readById(req.params.blackPlayer);
		if (entity) {
			next();
		} else {
			if (["1", "2", "3", "4", "5"].findIndex((fakePlayer: string) => fakePlayer === req.params.blackPlayer) !== -1) {
				res.status(404).send({error: `Game black pieces player not found: ` + req.params.whilePlayer});
			} else {
				next();
			}
		}
	}
	
	async validateState(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateState\n');
		// Validate type only if present
		if (!req.body.state) {
			// console.log('\n' + 'PlayerMiddleware/validateState: not present\n');
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'PlayerMiddleware/validateState:  ' + req.body.state + '\n');
			if (!isStateSupported(req.body.state)) {
				// console.log('\n' + 'PlayerMiddleware/validateState:  Invalid' + req.body.state + '\n');
				res.status(404).send({error: `Game state is invalid: ` + req.params.state});
			} else {
				// console.log('\n' + 'GameMiddleware/validateState:  Valid' + req.body.state + '\n');
				next();
			}
		}
		// console.log('\n' + 'GameMiddleware/validateState/state: ' + req.body.state + '\n');
	}
	
	async validateResult(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateResult\n');
		// Validate only if present
		if (!req.body.result) {
			// console.log('\n' + 'GameMiddleware/validateResult: not present\n');
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'GameMiddleware/validateResult:  ' + req.body.result + '\n');
			if (!isStringNumeric(req.body.result)) {
				// console.log('\n' + GameMiddleware/validateResult:  Invalid' + req.body.result + '\n');
				res.status(400).send({error: `GameMiddleware/validateResult result is not numeric: ` + req.body.result});
			} else {
				let result = Number(req.body.result);
				if (result in valid_results) {
					next()
				} else {
					res.status(400).send({error: `GameMiddleware/validateResult result is invalid: ` + req.body.result});
				}
			}
		}
	}
	
	async validateDate(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateResult\n');
		// Validate only if present
		if (!req.body.date) {
			// console.log('\n' + 'GameMiddleware/validateDate: not present\n');
			next()
		} else {
			let attribute = req.body.date;
			// it is present, hence must be valid
			console.log('\n' + 'GameMiddleware/validateDate:  ' + attribute + '\n');
			if (isValidDate(attribute)) {
				// console.log('\n' + GameMiddleware/validateDate valid: ' + attribute + '\n');
				next();
			} else {
				// console.log('\n' + GameMiddleware/validateDate invalid: ' + attribute + '\n');
				res.status(400).send({error: `GameMiddleware/validateDate date is invalid: ` + attribute});
			}
		}
	}
	async validatePatchableAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validatePatchableAttributes\n');
		req.body.id = req.params.id;
		next();
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
	
}
export default GameMiddleware.getInstance();

const isStateSupported = (state: string): boolean => {
	let requestState  = state.toLowerCase();
	// console.log('\n' + 'PlayerMiddleware/isStateSupported/type: ' + requestType + '\n');
	return states.findIndex((aValidState: string) => aValidState === requestState) !== -1;
}

