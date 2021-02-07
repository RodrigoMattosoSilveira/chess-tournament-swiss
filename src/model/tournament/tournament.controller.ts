// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created tournament services
import tournamentService from './tournament.service';

// we use debug with a custom context as described in Part 1
import debug from 'debug';

const log: debug.IDebugger = debug('app:tournament-controller');

class TournamentController {
	private static instance: TournamentController;
	
	// this will be a controller singleton (same pattern as before)
	static getInstance(): TournamentController {
		if (!TournamentController.instance) {
			TournamentController.instance = new TournamentController();
		}
		return TournamentController.instance;
	}
	
	async getAll(req: express.Request, res: express.Response) {
		const entities = await tournamentService.list(100, 0);
		res.status(200).send(entities);
	}
	
	async getById(req: express.Request, res: express.Response) {
		// console.log('TournamentController/getById/id' + req.params.id);
		const entity = await tournamentService.readById(req.params.id);
		res.status(200).send(entity);
	}
	
	async create(req: express.Request, res: express.Response) {
		// console.log("TournamentController/create: " + JSON.stringify(req.body) +"\n");
		const id = await tournamentService.create(req.body);
		// console.log("TournamentController/create id: " + id +"\n");
		res.status(201).send({id: id});
	}
	
	async patch(req: express.Request, res: express.Response) {
		log(await tournamentService.patchById(req.body));
		const tournament = await tournamentService.readById(req.params.id);
		res.status(200).send(tournament);
	}
	
	async put(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot PUT a TOURNAMENT. Consider patching it instead`);
	}
	
	async delete(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot DELETE a TOURNAMENT. Consider patching its state to INACTIVE`);
	}
	
}

export default TournamentController.getInstance();
