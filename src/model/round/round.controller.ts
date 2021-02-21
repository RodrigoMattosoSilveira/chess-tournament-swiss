// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created tournament services
import roundService from './round.service';

// we use debug with a custom context as described in Part 1
import debug from 'debug';

const log: debug.IDebugger = debug('app:round-controller');

class RoundController {
	private static instance: RoundController;
	
	// this will be a controller singleton (same pattern as before)
	static getInstance(): RoundController {
		if (!RoundController.instance) {
			RoundController.instance = new RoundController();
		}
		return RoundController.instance;
	}
	
	async getAll(req: express.Request, res: express.Response) {
		const entities = await roundService.list(/* 100, 0 */); // add it when working with DB
		res.status(200).send(entities);
	}
	
	async getById(req: express.Request, res: express.Response) {
		// console.log('RoundController/getById/id' + req.params.id);
		const entity = await roundService.readById(req.params.id);
		res.status(200).send(entity);
	}
	
	async create(req: express.Request, res: express.Response) {
		// console.log("RoundController/create: " + JSON.stringify(req.body) +"\n");
		const id = await roundService.create(req.body);
		// console.log("RoundController/create id: " + id +"\n");
		res.status(201).send({id: id});
	}
	
	async patch(req: express.Request, res: express.Response) {
		log(await roundService.patchById(req.body));
		const tournament = await roundService.readById(req.params.id);
		res.status(200).send(tournament);
	}
	
	async put(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot PUT a ROUND. Consider patching it instead`);
	}
	
	async delete(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot DELETE a ROUND. Consider patching its state to INACTIVE`);
	}
}
export default RoundController.getInstance();
