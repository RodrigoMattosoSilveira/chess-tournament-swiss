import express from 'express';

// todo: apply this generalization to all other entities
import service from './tournament.service';
import tournamentService from "../tournament/tournament.service";
import {user_states} from "../../contants/contants";

class TournamentMiddleware {
	private static instance: TournamentMiddleware;
	private valid_states = ["planned", "scheduled", "closed", "underway", "complete"]
	private valid_types = ["round", "swiss", "match", "elimination"]
	
	static getInstance() {
		if (!TournamentMiddleware.instance) {
			TournamentMiddleware.instance = new TournamentMiddleware();
		}
		return TournamentMiddleware.instance;
	}
	
	async validateSameNameDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
		const tournament = await tournamentService.getByName(req.body.name);
		if (tournament) {
			res.status(400).send({error: `Tournament name already exists: ` + req.body.name});
		} else {
			next();
		}
	}
	
	async validateRequiredBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'TournamentMiddleware/validateRequiredBodyFields/body: ' + JSON.stringify(req.body) + '\n');
		if (req.body && req.body.name && req.body.rounds && req.body.type) {
			next();
		} else {
			res.status(400).send({error: `Missing one or more required fields: name, rounds, type`});
		}
	}
	async validateExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'TournamentMiddleware/validateExists/id: ' + req.body.id + '\n');
		const entity = await service.readById(req.params.id);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: `entity ${req.params.id} not found`});
		}
	}
	
	async validateType(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'TournamentMiddleware/validateType/type: ' + req.body.type + '\n');
		// type must be supported
		if (!isTypeSupported(req.body.type) ) {
			res.status(404).send({error: `type ${req.params.type} is invalid`});
		}
		next();
	}
	
	async validateTypeIfPresent(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateTypeIfPresent/type: ' + req.body.type + '\n');
		// Validate type only if present
		if (!req.body.type) { next() }
		
		// it is present, hence must be valid
		if (!isTypeSupported(req.body.type)) {
			res.status(404).send({error: `type ${req.params.type} is invalid`});
		}
		next();
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'TournamentMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
}

export default TournamentMiddleware.getInstance();

/**
 * Asserts whether type is a supported tournanment type
 * @param type
 * @return -1 if type is not a supported tournanment type, non-negative value if so.
 */
const isTypeSupported = (type: string): boolean => {
	let requestType  = type.toLowerCase();
	console.log('\n' + 'TournamentMiddleware/isTypeSupported/type: ' + requestType + '\n');
	return user_states.findIndex((aValidType: string) => aValidType === requestType) !== -1;
}

