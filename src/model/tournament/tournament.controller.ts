// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created tournament services
import tournamentService from './tournament.service';

// we use debug with a custom context as described in Part 1
import debug from 'debug';
import {TournamentUtil} from "./tournament.utils";
import {DaoResult} from "../../common/generic.interfaces";
import {UserDto} from "../user/user.interfaces";
import userService from "../user/user.service";
import {OneMany} from "@rmstek/rms-ts-monad";
import {ITournamentPatch, TOURNAMENT_PATCH_KEYS, TournamentDto} from "./tournament.interfaces";
import argon2 from "argon2";

const log: debug.IDebugger = debug('app:tournament-controller');

class TournamentController {
	private static instance: TournamentController;
	private static tournamentUtil: TournamentUtil = TournamentUtil.getInstance();
	
	// this will be a controller singleton (same pattern as before)
	static getInstance(): TournamentController {
		if (!TournamentController.instance) {
			TournamentController.instance = new TournamentController();
		}
		return TournamentController.instance;
	}

	async create(req: express.Request, res: express.Response) {
		// console.log("TournamentController/create: " + JSON.stringify(req.body) +"\n");
		TournamentController.tournamentUtil.lAddAttributeDefaults(req.body);
		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.create(req.body);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Tournament Service / create - Should have received only record, got many");}
				)
			},
		);
	}

	async read(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.read(/* 100, 0 */);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {
						res.status(500).send("Tournament Service / create - Should have received a record collection, got one record");
					},
					/* ifMany */ () => {
						res.status(daoResult.code).send(result.get());
					}
				);
			},
		);
	}

	async patch(req: express.Request, res: express.Response) {
		// console.log(`UserController/Patch: ${JSON.stringify(req.body)}`);
		let update: ITournamentPatch = {id: ""}
		for (let field of TOURNAMENT_PATCH_KEYS) {
			if (field in req) {
				// @ts-ignore
				update[field] = req[field];
			}
		}

		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.patch(update);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Tournament/Controller/patch - Should have patched only record, patched many");})
			},
		);
	}

	async readById(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.readByName(req.params.id);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send(`Tournament/Controller/readById - Should have received only record: ${req.params.name}, got many`);})
			},
		);
	}

	//TODO Add logic to return a boolean, true if exists, false otherwise
	async idExists(id: string): Promise<boolean> {
		let idExists: boolean = false;
		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.readById(id);
		daoResult.content.fold(
			(err: string) => {
				idExists = false;
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {idExists = true;},
					/* ifMany */ () => {idExists = false;}
				)
			},
		);
		return idExists;
	}

	async readByName(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.readById(req.params.name);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send(`Tournament/Controller - Should have received only record: ${req.params.id}, got many`);})
			},
		);
	}

	async nameExists(name: string): Promise<boolean> {
		let nameExists: boolean = false;
		const daoResult: DaoResult<TournamentDto, TournamentDto[]> = await tournamentService.readById(name);
		daoResult.content.fold(
			(err: string) => {
				nameExists = false;
			},
			(result: OneMany<TournamentDto, TournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {nameExists = true;},
					/* ifMany */ () => {nameExists = false;}
				)
			},
		);
		return nameExists;
	}

}

export default TournamentController.getInstance();
