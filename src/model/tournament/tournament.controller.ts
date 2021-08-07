// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created tournament services
import tournamentService from './tournament.service';

// we use debug with a custom context as described in Part 1
import {TournamentUtil} from "./tournament.utils";
import {DaoResult} from "../../common/generic.interfaces";
import {OneMany} from "@rmstek/rms-ts-monad";
import {ITournamentPatch, TOURNAMENT_PATCH_KEYS, ITournamentDto} from "./tournament.interfaces";

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
		const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.create(req.body);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Tournament Service / create - Should have received only record, got many");}
				)
			},
		);
	}

	async read(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.read(/* 100, 0 */);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
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
		let update: ITournamentPatch = {eid: ""};
		for (let field of TOURNAMENT_PATCH_KEYS) {
			if (field in req) {
				// @ts-ignore
				update[field] = req[field];
			}
		}

		const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.patch(update);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send("Tournament/Controller/patch - Should have patched only record, patched many");})
			},
		);
	}

	async readByEid(req: express.Request, res: express.Response) {
		const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.readByEid(req.params.eid);
		daoResult.content.fold(
			(err: string) => {
				res.status(daoResult.code).send(err);
			},
			(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
					/* ifMany */ () => {res.status(500).send(`Tournament/Controller/readById - Should have received only record: ${req.params.name}, got many`);})
			},
		);
	}

	//TODO Add logic to return a boolean, true if exists, false otherwise
	async eidExists(eid: string): Promise<boolean> {
		let idExists: boolean = false;
		const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.readByEid(eid);
		daoResult.content.fold(
			(err: string) => {
				idExists = false;
			},
			(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
				// res.status(daoResult.code).send(result.content.get());
				result.fold(
					/* ifOne */  () => {idExists = true;},
					/* ifMany */ () => {idExists = false;}
				)
			},
		);
		return idExists;
	}

	//TODO add logic to support parameter searches, as for instance, tournament name. Note that when changing the name
	// we ensure the new name is unique
	// async readByName(req: express.Request, res: express.Response) {
	// 	const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.readByName(req.params.name);
	// 	daoResult.content.fold(
	// 		(err: string) => {
	// 			res.status(daoResult.code).send(err);
	// 		},
	// 		(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
	// 			// res.status(daoResult.code).send(result.content.get());
	// 			result.fold(
	// 				/* ifOne */  () => {res.status(daoResult.code).send(result.get());},
	// 				/* ifMany */ () => {res.status(500).send(`Tournament/Controller - Should have received only record: ${req.params.eid}, got many`);})
	// 		},
	// 	);
	// }

	async nameExists(name: string): Promise<boolean> {
		let nameExists: boolean = false;
		const daoResult: DaoResult<ITournamentDto, ITournamentDto[]> = await tournamentService.readByName(name);
		daoResult.content.fold(
			(err: string) => {
				nameExists = false;
			},
			(result: OneMany<ITournamentDto, ITournamentDto[]>) => {
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
