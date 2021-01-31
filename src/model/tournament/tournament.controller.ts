// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created tournament services
import tournamentService from './tournament.service';

// we import the argon2 library for password hashing
import argon2 from 'argon2';

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
		console.log('TournamentController/getById/id' + req.params.id);
		const entity = await tournamentService.readById(req.params.id);
		res.status(200).send(entity);
	}
	
	async create(req: express.Request, res: express.Response) {
		const id = await tournamentService.create(req.body);
		res.status(201).send({id: id});
	}
	
	async patch(req: express.Request, res: express.Response) {
		if(req.body.password){
			req.body.password = await argon2.hash(req.body.password);
		}
		log(await tournamentService.patchById(req.body));
		res.status(204).send(``);
	}
	
	async put(req: express.Request, res: express.Response) {
		req.body.password = await argon2.hash(req.body.password);
		log(await tournamentService.updateById({id: req.params.userId, ...req.body}));
		res.status(204).send(``);
	}
	
	async remove(req: express.Request, res: express.Response) {
		log(await tournamentService.deleteById(req.params.userId));
		res.status(204).send(``);
	}
}

export default TournamentController.getInstance();
