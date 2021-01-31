import express from 'express';

// todo: apply this generalization to all other entities
import service from './tournament.service';
import tournamentService from "../tournament/tournament.service";

class TournamentMiddleware {
	private static instance: TournamentMiddleware;
	
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
		console.log('\n' + 'TournamentMiddleware/validateRequiredBodyFields/id: ' + JSON.stringify(req.body) + '\n');
		if (req.body && req.body.name && req.body.rounds) {
			next();
		} else {
			res.status(400).send({error: `Missing one or more required fields: name, rounds`});
		}
	}
	async validateExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'TournamentMiddleware/validateExists/id: ' + req.params.id + '\n');
		const entity = await service.readById(req.params.id);
		if (entity) {
			next();
		} else {
			res.status(404).send({error: `entity ${req.params.id} not found`});
		}
	}
	
	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log('\n' + 'TournamentMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
}

export default TournamentMiddleware.getInstance();
