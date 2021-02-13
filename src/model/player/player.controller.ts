// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created player services
import playerService from './player.service';

// we use debug with a custom context as described in Part 1
import debug from 'debug';

const log: debug.IDebugger = debug('app:player-controller');

class PlayerController {
	private static instance: PlayerController;
	
	// this will be a controller singleton (same pattern as before)
	static getInstance(): PlayerController {
		if (!PlayerController.instance) {
			PlayerController.instance = new PlayerController();
		}
		return PlayerController.instance;
	}
	
	async getAll(req: express.Request, res: express.Response) {
		const entities = await playerService.list(/* 100, 0 */); // add it when working with DB
		res.status(200).send(entities);
	}
	
	async getById(req: express.Request, res: express.Response) {
		// console.log('PlayerController/getById/id' + req.params.id);
		const entity = await playerService.readById(req.params.id);
		res.status(200).send(entity);
	}
	
	async create(req: express.Request, res: express.Response) {
		// console.log("PlayerController/create: " + JSON.stringify(req.body) +"\n");
		const id = await playerService.create(req.body);
		// console.log("PlayerController/create id: " + id +"\n");
		res.status(201).send({id: id});
	}
	
	async patch(req: express.Request, res: express.Response) {
		log(await playerService.patchById(req.body));
		const player = await playerService.readById(req.params.id);
		res.status(200).send(player);
	}
	
	async put(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot PUT a PLAYER. Consider patching it instead`);
	}
	
	async delete(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot DELETE a PLAYER. Consider patching its state to INACTIVE`);
	}
	
}

export default PlayerController.getInstance();
