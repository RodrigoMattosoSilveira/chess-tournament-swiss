import express from 'express';

// todo: apply this generalization to all other entities
// import service from './game.service';
import {
	game_results,
	GAME_STATES,
	game_states,
	PATCHABLE_GAME_ATTRIBUTES,
	REQUIRED_GAME_ATTRIBUTES
} from "./game.constants";
import gameService from "./game.service";
import playerService from "../player/player.service";
import tournamentService from "../tournament/tournament.service";
import { isValidDate } from "../../utils/utils";

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
			for (let i = 0; i < REQUIRED_GAME_ATTRIBUTES.length; i < i++) {
				let requiredAttribute = REQUIRED_GAME_ATTRIBUTES[i];
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
		const entity = await gameService.readById(req.body.id);
		if (entity) {
			next();
		} else {
			res.status(400).send({error: `Game id not found: ` + req.body.id});
		}
	}
	
	async validateTournament(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateTournament' + '\n');
		const entity = await tournamentService.readById(req.body.tournament);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: `Tournament not found: ` + req.body.tournament});
		}
	}
	
	async validateWhitePiecesPlayer(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'GameMiddleware/validateWhitePiecesPlayer: ' + JSON.stringify(req.body) +'\n');
		const entity = await playerService.readById(req.body.whitePiecesPlayer);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: `Game white pieces player not found: ` + req.body.whitePiecesPlayer});
		}
	}
	
	async validateBlackPiecesPlayer(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateBlackPiecesPlayer : Player exists' + '\n');
		const entity = await playerService.readById(req.body.blackPiecesPlayer);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: `Game black pieces player not found: ` + req.body.blackPiecesPlayer});
		}
	}
	
	async validateState(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateState\n');
		// Validate type only if present
		if (!req.body.state) {
			// console.log('\n' + 'PlayerMiddleware/validateState: not present\n');
			next()
		} else {
			// It is present; we can only patch the state to UNDERWAY;
			// We create the game with SCHEDULED as the default state;
			// We patch it to COMPLETE when we handle the result patch;
			// console.log('\n' + 'PlayerMiddleware/validateState:  ' + req.body.state + '\n');
			if (req.body.state !== GAME_STATES.UNDERWAY) {
				// console.log('\n' + 'PlayerMiddleware/validateState:  Invalid' + req.body.state + '\n');
				res.status(404).send({error: `Game state is invalid: ` + req.body.state});
			} else {
				// console.log('\n' + 'GameMiddleware/validateState:  Valid' + req.body.state + '\n');
				next();
			}
		}
		// console.log('\n' + 'GameMiddleware/validateState/state: ' + req.body.state + '\n');
	}
	
	async validateResult(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/validateResult\n');
		// Validate result only if present
		if (!req.body.result) {
			// console.log('\n' + 'PlayerMiddleware/validateResult: not present\n');
			next()
		} else {
			// it is present, hence must be valid
			// console.log('\n' + 'PlayerMiddleware/validateResult:  ' + req.body.result + '\n');
			if (!isResultSupported(req.body.result)) {
				// console.log('\n' + 'PlayerMiddleware/validateResult:  Invalid' + req.body.result + '\n');
				res.status(404).send({error: `Game result is invalid: ` + req.body.result});
			} else {
				console.log('\n' + 'GameMiddleware/validateResult:  Valid' + req.body.result + '\n');
				// PATCH the game state to COMPLETE
				req.body.state = GAME_STATES.COMPLETE;
				console.log('\n' + 'GameMiddleware/validateResult:  ' + JSON.stringify(req.body) + '\n');
				next();
			}
		}
		// console.log('\n' + 'GameMiddleware/validateResult/result: ' + req.body.result + '\n');
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
		let errorMessage = isValidPatchableAttributes(req.body, PATCHABLE_GAME_ATTRIBUTES);
		if (errorMessage.length ===0 ) {
			next();
		} else {
			res.status(400).send({error: `GameMiddleware/validatePatchableAttributes attributes are invalid: ` + errorMessage});
		}
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'GameMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
	
}
export default GameMiddleware.getInstance();

const isResultSupported = (result: string): boolean => {
	// console.log('\n' + 'GameMiddleware/isResultSupported/result: ' + result + '\n');
	let lowerCaseResult  = result.toLowerCase();
	return game_results.findIndex((aValidState: string) => aValidState === lowerCaseResult) !== -1;
}

const isValidPatchableAttributes = (attributes:any, patchableAttributes: Array<string>): string => {
	let foundInvalidAttributes = "";
	let attributesKeys: Array<string> = Object.keys((attributes));
	if (attributesKeys.length === 0) {
		foundInvalidAttributes = "there are no attributes to patch";
	} else {
		attributesKeys.forEach((thisAttribute, index,array) => {
			if (patchableAttributes.findIndex((aValidAttribute: string) => aValidAttribute === thisAttribute) === -1) {
				foundInvalidAttributes += foundInvalidAttributes.length === 0 ? "" : ", ";
				foundInvalidAttributes += thisAttribute;
			}
		});
	}
	return foundInvalidAttributes;
}

