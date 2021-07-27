// TODO: review test in detail for new architecture

import express from "express";

import {GAME_STATES} from "./game.constants";

const request = require('supertest');

import { Utils } from "../../utils/utils";
import {TOURNAMENT_TYPE} from "../../contants/contants";
import {AMongoDb, MongoInMemory} from "../../server/mongodb";
import {ISwissPairingServers} from "../../server/swiss-pairings-interface";

import {launchServers, stopServers} from "../../server/swiss-pairing";

import {IConfig} from "../../config/config.interface";
let config: IConfig = require('../../config/config.dev.json');


describe('Game Entity', () => {
	const utils = new Utils();
	let resource = '/game';
	let response: any;
	let gameId: string;
	let userEntity_1: any;
	let userEntity_2: any;
	let tournamentEntity: any;
	let playerEntity_1: any;
	let playerEntity_2: any;
	let gameEntity: any;
	let gamePatch: any;
	let mongodb: AMongoDb;
	let swissPairingServers: ISwissPairingServers;
	let app: express.Application;

	beforeAll(async done => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		swissPairingServers = launchServers(mongodb);
		app = swissPairingServers.applicationServer;

		// add tournament
		tournamentEntity = {
			name: "Blanchard Open 2021",
			rounds: 6,
			maxPlayers: 65,
			type: TOURNAMENT_TYPE.SWISS
		}
		// add user 1
		userEntity_1 = {
			email: "Adeline.Hodge@yahoo.com",
			password: "oPT14J30I#y4",
			rating: 2043
		}
		// add user 2
		userEntity_2 = {
			email: "Maryjane.Lowe@yahoo.com",
			password: "oPT14J30I#y5",
			rating: 1957
		}
		// add player 1
		playerEntity_1 = {
			user: "",
			tournament: ""
		}
		// add player 2
		playerEntity_2 = {
			user: "",
			tournament: ""
		}
		done();
	})

	afterEach(async () => {
		await mongodb.clear();
	});

	afterAll(async () => {
		stopServers(mongodb, swissPairingServers.httpServer);
	});
	describe('GET', () => {
		it('/game', async done => {
			response = await request(app)
				.get(resource)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					// expect(response.body).toEqual([]);
					expect(response.body).toBeTruthy();
					done();
				})
				.catch((err: any) => {
					// console.log('\nGET /game: ' + err + '\n');
					done(err)
				});
			done();
		})
	});
	describe('POST', () => {
		// Note: You must have the application running in a different terminal for this to work
		it('/game', async done => {
			gameEntity = {
				// tournament: tournamentId,
				// whitePiecesPlayer: playerId_1,
				// blackPiecesPlayer: playerId_2,
				tournament: "Zvei69rE0",
				whitePiecesPlayer: "L32ss05q2n",
				blackPiecesPlayer: "bMNZi9Dvwd"
			}
			console.log('\nPost a player: ' + JSON.stringify(gameEntity) + '\n');
			await request(app)
				.post("/game")
				.send(gameEntity)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					console.log('\nPOSTed a player: ' + response.body.id + '\n');
					expect(response.body.id).toBeTruthy()
					gameId = response.body.id;
					done();
				})
				.catch((err: any) => {
					console.log('\nPOST /player - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nPOSTed a player 1: ' + playerId + '\n');
			done();
		});
	});
	// Appended  the `-`to force JEST to run post prior to running this one
	describe('GET-', () => {
		it('/game/<id>', async done => {
			await request(app)
				.get("/game/" + gameId)
				.send(gameEntity)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					console.log('\nGET<id> a player: ' + response.body.id + '\n');
					expect(response.body.tournament).toEqual(gameEntity.tournament);
					expect(response.body.whitePiecesPlayer).toEqual(gameEntity.whitePiecesPlayer);
					expect(response.body.blackPiecesPlayer).toEqual(gameEntity.blackPiecesPlayer);
					expect(response.body.state).toEqual(GAME_STATES.SCHEDULED);
					let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/")
					let testDate = new Date(response.body.date)
					expect(testDate.getMonth()).toEqual((Number(month)-1));
					expect(testDate.getDate()).toEqual(Number(day));
					expect(testDate.getFullYear()).toEqual(Number(year));
					done();
				})
				.catch((err: any) => {
					console.log('\nPOST /player - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nPOSTed a player 1: ' + playerId + '\n');
			done();
		});
	});
	describe('PATCH ', () => {
		it('/game/<id> all patchable attributes', async done => {
			gamePatch = {
				"state": GAME_STATES.UNDERWAY,
				"date": "4/2/2021"
			}
			await request(app)
				.patch("/game/" + gameId)
				.send(gamePatch)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					console.log('\nGET<id> a player: ' + response.body.id + '\n');
					expect(response.body.tournament).toEqual(gameEntity.tournament);
					expect(response.body.whitePiecesPlayer).toEqual(gameEntity.whitePiecesPlayer);
					expect(response.body.blackPiecesPlayer).toEqual(gameEntity.blackPiecesPlayer);
					expect(response.body.state).toEqual(GAME_STATES.UNDERWAY);
					let testDate = new Date(response.body.date)
					expect(testDate.getMonth()).toEqual(4 - 1);
					expect(testDate.getDate()).toEqual(Number(2));
					expect(testDate.getFullYear()).toEqual(Number(2021));
					done();
				})
				.catch((err: any) => {
					console.log('\nPATCH /player - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nPOSTed a player 1: ' + playerId + '\n');
			done();
		});
		it('/game/<id> result', async done => {
			gamePatch = {
				"result": "1-0"
			}
			await request(app)
				.patch("/game/" + gameId)
				.send(gamePatch)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					console.log('\nGET<id> a player: ' + response.body.id + '\n');
					expect(response.body.tournament).toEqual(gameEntity.tournament);
					expect(response.body.whitePiecesPlayer).toEqual(gameEntity.whitePiecesPlayer);
					expect(response.body.blackPiecesPlayer).toEqual(gameEntity.blackPiecesPlayer);
					let testDate = new Date(response.body.date)
					expect(testDate.getMonth()).toEqual(4 - 1);
					expect(testDate.getDate()).toEqual(Number(2));
					expect(testDate.getFullYear()).toEqual(Number(2021));
					expect(response.body.result).toEqual("1-0");
					expect(response.body.state).toEqual(GAME_STATES.COMPLETE);
					done();
				})
				.catch((err: any) => {
					console.log('\nPATCH /player - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nPOSTed a player 1: ' + playerId + '\n');
			done();
		});
	});
})
