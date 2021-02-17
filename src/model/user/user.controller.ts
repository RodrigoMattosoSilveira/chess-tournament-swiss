// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created user services
import userService from './user.service';

// we import the argon2 library for password hashing
import argon2 from 'argon2';

// we use debug with a custom context as described in Part 1
import debug from 'debug';

const log: debug.IDebugger = debug('app:user-controller');

class UserController {
	private static instance: UserController;
	
	// this will be a controller singleton (same pattern as before)
	static getInstance(): UserController {
		if (!UserController.instance) {
			UserController.instance = new UserController();
		}
		return UserController.instance;
	}
	
	async listUsers(req: express.Request, res: express.Response) {
		const users = await userService.list(/* 100, 0 */);
		res.status(200).send(users);
	}
	
	async getUserById(req: express.Request, res: express.Response) {
		const user = await userService.readById(req.params.userId);
		res.status(200).send(user);
	}
	
	async createUser(req: express.Request, res: express.Response) {
		req.body.password = await argon2.hash(req.body.password);
		const userId = await userService.create(req.body);
		res.status(201).send({id: userId});
	}
	
	async patch(req: express.Request, res: express.Response) {
		// console.log('\n' + 'UserController/patch' + JSON.stringify(req.body) +'\n');
		if(req.body.password){
			req.body.password = await argon2.hash(req.body.password);
		}
		log(await userService.patchById(req.body));
		const user = await userService.readById(req.params.userId);
		res.status(200).send(user);
	}
	
	async put(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot PUT a USER. Consider patching it instead`);
	}
	
	async delete(req: express.Request, res: express.Response) {
		res.status(405).send(`You cannot DELETE a USER. Consider patching its state to INACTIVE`);
	}
}

export default UserController.getInstance();
