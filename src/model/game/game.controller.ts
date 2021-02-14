import express from "express";
import debug from 'debug'; // we use debug with a custom context as described in Part 1
const log: debug.IDebugger = debug('app:player-controller');

import gameService from "./game.service";

class GameController {
	private static instance: GameController;
	
	// this will be a controller singleton (same pattern as before)
	static getInstance(): GameController {
		if (!GameController.instance) {
			GameController.instance = new GameController();
		}
		return GameController.instance;
	}
	
	async getAll(req: express.Request, res: express.Response) {
		console.log('\nGameController/getAll\n');
		const entities = await gameService.list(/* 100, 0 */); // add it when working with DB
		res.status(200).send(entities);
	}
	
	async getById(req: express.Request, res: express.Response) {
		console.log('GameController/getById/id' + req.params.id);
		const entity = await gameService.readById(req.params.id);
		res.status(200).send(entity);
	}
	
	async create(req: express.Request, res: express.Response) {
		// console.log("PlayerGameControllerController/create: " + JSON.stringify(req.body) +"\n");
		const id = await gameService.create(req.body);
		// console.log("GameController/create id: " + id +"\n");
		res.status(201).send({id: id});
	}
	
	async patch(req: express.Request, res: express.Response) {
		log(await gameService.patchById(req.body));
		const player = await gameService.readById(req.params.id);
		res.status(200).send(player);
	}
	
	async put(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot PUT a GAME. Consider patching it instead`);
	}
	
	async delete(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot DELETE a GAME. Consider patching its state to INACTIVE`);
	}
	
	
}
export default GameController.getInstance();
