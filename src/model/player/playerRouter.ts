import express, { Request, Response } from 'express';
import { playerController } from './index';

export const PlayerRouter = express.Router({
	strict: true
});

PlayerRouter.post('/', (req: Request, res: Response) => {
	playerController.create(req, res);
});

// Read all players
PlayerRouter.get('/', (req: Request, res: Response) => {
	console.log("PlayerRouter/method " + JSON.stringify(req.method));
	console.log("PlayerRouter/app/router-params " + JSON.stringify(req.params));
	playerController.read(req, res);
});

// Read a player
PlayerRouter.get('/:id', (req: Request, res: Response) => {
	console.log("PlayerRouter/method " + JSON.stringify(req.method));
	console.log("PlayerRouter/app/router-params " + JSON.stringify(req.params));
	playerController.read(req, res);
});

// Update a player
PlayerRouter.put('/:id', (req: Request, res: Response) => {
	console.log("PlayerRouter/method " + JSON.stringify(req.method));
	console.log("PlayerRouter/app/PUT/router-params " + JSON.stringify(req.params));
	console.log("PlayerRouter/app/PUT/body " + JSON.stringify(req.body));
	playerController.update(req, res);
});

// Delete a player
PlayerRouter.delete('/:id', (req: Request, res: Response) => {
	console.log("PlayerRouter/method " + JSON.stringify(req.method));
	console.log("PlayerRouter/app/router-params " + JSON.stringify(req.params));
	playerController.delete(req, res);
});
