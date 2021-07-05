// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created user services
import userService from './user.service';
import {UserUtil} from "./user.util";
import { OneMany } from '@rmstek/rms-ts-monad';

// we import the argon2 library for password hashing
import argon2 from 'argon2';

// we use debug with a custom context as described in Part 1
import debug from 'debug';
import { DaoResult} from "../../common/generic.interfaces";
import { UserDto } from "./user.interfaces";

const log: debug.IDebugger = debug('app:user-controller');

class UserController {
	private static instance: UserController;
	private static userUtil: UserUtil = UserUtil.getInstance();

	// this will be a controller singleton (same pattern as before)
	static getInstance(): UserController {
		if (!UserController.instance) {
			UserController.instance = new UserController();
		}
		return UserController.instance;
	}

	async create(req: express.Request, res: express.Response) {
		UserController.userUtil.lAddAttributeDefaults(req.body);
		const daoResult: DaoResult<UserDto, UserDto[]> = await userService.create(req.body);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<UserDto, UserDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Should have received only record, got many");}
				)
			},
		);
	}

	async getById(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<UserDto, UserDto[]> = await userService.readById(req.params.userId);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<UserDto, UserDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Should have received only record, got many");})
			},
		);
	}

	async list(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<UserDto, UserDto[]> = await userService.list(/* 100, 0 */);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<UserDto, UserDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(500).send("Should have received a record collection, got one record");},
					/* ifMany */ () => {res.status(daoResult.code).send(result.get());})
			},
		);

	}

	async patch(req: express.Request, res: express.Response) {
		// console.log('\n' + 'UserController/patch' + JSON.stringify(req.body) +'\n');
		if(req.body.password){
			req.body.password = await argon2.hash(req.body.password);
		}
		log(await userService.patchById(req.body));
		const daoResult: DaoResult<UserDto, UserDto[]> = await userService.readById(req.params.userId);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<UserDto, UserDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Should have patched only record, patched many");})
			},
		);
	}
	//
	// async put(req: express.Request, res: express.Response) {
	// 	res.status(405).send(`You cannot PUT a USER. Consider patching it instead`);
	// }
	//
	// async delete(req: express.Request, res: express.Response) {
	// 	res.status(405).send(`You cannot DELETE a USER. Consider patching its state to INACTIVE`);
	// }
}

export default UserController.getInstance();
