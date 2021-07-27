// TODO: review test in detail for new architecture
import express from "express";

import { DaoResult } from "../../common/generic.interfaces";
import { OneMany } from '@rmstek/rms-ts-monad';

const request = require('supertest');

import { Utils } from "../../utils/utils";
import tournamentDao from "../tournament/tournament.dao";
import userDao from "../user/user.dao";
import {PLAYER_STATE, TOURNAMENT_TYPE} from "../../contants/contants";
import {UserDto} from "../user/user.interfaces";
import {AMongoDb, MongoInMemory} from "../../server/mongodb";
import {ISwissPairingServers} from "../../server/swiss-pairings-interface";
import {launchServers, stopServers} from "../../server/swiss-pairing";

import {IConfig} from "../../config/config.interface";
let config: IConfig = require('../../config/config.dev.json');

describe('Player Entity', () => {
	const utils = new Utils();
	let resource = '/player';
	let response: any;
	let tournamentId: string;
	let userId: string | undefined;
	let playerId: string;
	let userEntity: any;
	let tournamentEntity: any;
	let playerEntity: any;
	let daoResult: DaoResult<UserDto, UserDto[]>;
	let mongodb: AMongoDb;
	let swissPairingServers: ISwissPairingServers;
	let app: express.Application;

	beforeAll(async () => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		swissPairingServers = launchServers(mongodb);
		app = swissPairingServers.applicationServer;
	});

	afterEach(async () => {
		await mongodb.clear();
	});

	afterAll(async () => {
		stopServers(mongodb, swissPairingServers.httpServer);
	});

	describe('GET /player', () => {
		it('GET /player', async done => {
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
					// console.log('\nGET /player: ' + err + '\n');
					done(err)
				});
			done();
		})
	});
	describe('POST /player and GET /player/id', () => {
		beforeAll(async done => {
			// Create a user to help POST a player
			userEntity = {
				email: "a.b@c.com",
				firstName: "=Jon",
				lastName: "Doe",
				password: "easytobreak"
			};
			daoResult = await userDao.create(userEntity);
			daoResult.content.fold(
				(err: string) => {
					// console.log('\nError creating a user to help POST a player: ' + err + '\n');
					done(err)
				},
				(result: OneMany<UserDto, UserDto[]>) => {
					result.fold(
						/* ifOne */  () => {
							// @ts-ignore
							let userDao: UserDto = result.get();
							userId = userDao.id;
							// console.log('\nCreated user to help POST a player: ' + userId + '\n');

							// Create a tournament to help POST a player
							tournamentEntity = {
								name: "Blanchard Open - 2021",
								maxPlayers: 32,
								rounds: 6,
								type: TOURNAMENT_TYPE.SWISS
							}
							tournamentDao.add(tournamentEntity)
								.then((id: string) => {
									tournamentId = id;
									// console.log('\nCreated tournament to help POST a player: ' + tournamentId + '\n');
									// console.log('\nCreated user and tournament to help POST a player: ' + userId + " " + tournamentId + '\n');
								})
								.catch((err: any) => {
									// console.log('\nError creating a tournament to help POST a player: ' + err + '\n');
									done(err)
								});
							},
						/* ifMany */ () => {done("Should have received only record, got many");}
					)

				}
			)
			done();
		});
		it('POST /player', async done => {
			// console.log('\nAbout to POST a player: ' + userId + " " + tournamentId + '\n');
			playerEntity = {
				user: userId,
				tournament: tournamentId
			};
			await request(app)
				.post("/player")
				.send(playerEntity)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					// console.log('\nPOSTed a player: ' + response.body.id + '\n');
					expect(response.body.id).toBeTruthy()
					playerId = response.body.id;
				})
				.catch((err: any) => {
					// console.log('\nPOST /player - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nPOSTed a player 1: ' + playerId + '\n');
			done();
		});
		it('GET /player/id', async done => {
			// console.log('\nAbout to GET a posted: ' + userId + " " + playerId + '\n');
			await request(app)
				.get("/player/" + playerId)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					// console.log('\nGot POSTed player: ' + response.body.id + '\n');
					expect(response.body.id).toEqual(playerId);
					expect(response.body.user).toEqual(userId);
					expect(response.body.tournament).toEqual(tournamentId);
					expect(response.body.hadByeOrForfeit).toEqual(false);
					expect(response.body.byeNextRound).toEqual(false);
					expect(response.body.playedAgainst).toEqual([]);
					expect(response.body.playedColor).toEqual([]);
					expect(response.body.results).toEqual([]);
					expect(response.body.state).toEqual(PLAYER_STATE.ACTIVE);
					playerId = response.body.id;
				})
				.catch((err: any) => {
					// console.log('\nPOST /player - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nGot POSTed player: ' + playerId + '\n');
			done();
		});
	});
	describe('PATCH /player:id', () => {
		beforeAll(() => {
			// console.log("About to validate the patch capability: " + playerId + "\n")
		})
		it('all patchable attributes', async done => {
			// console.log("About to validate the patch capability: " + playerId + "\n");
			let patchEntity: any = {
				"hadByeOrForfeit": true,
				"byeNextRound": true,
				"playedAgainst": ["a1x_V1h5Mq", "mgjR2IAh72"],
				"playedColor": [-1, 1],
				"results": [0, 1],
				"state": "inactive"
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.hadByeOrForfeit).toEqual(patchEntity.hadByeOrForfeit);
			expect(response.body.byeNextRound).toEqual(patchEntity.byeNextRound);
			expect(response.body.playedAgainst).toEqual(patchEntity.playedAgainst);
			expect(response.body.playedColor).toEqual(patchEntity.playedColor);
			expect(response.body.results).toEqual(patchEntity.results);
			expect(response.body.state).toEqual(patchEntity.state);
			done();
		});
		it('the hadByeOrForfeit attribute', async done => {
			let patchEntity: any = {
				"hadByeOrForfeit": false,
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.hadByeOrForfeit).toEqual(patchEntity.hadByeOrForfeit);
			done();
		});
		it('the byeNextRound attribute', async done => {
			let patchEntity: any = {
				"byeNextRound": false,
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.byeNextRound).toEqual(patchEntity.byeNextRound);
			done();
		});
		it('the playedColor attribute', async done => {
			let patchEntity: any = {
				"playedColor": [],
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.playedColor).toEqual(patchEntity.playedColor);
			done();
		});
		it('the playedAgainst attribute', async done => {
			let patchEntity: any = {
				"playedAgainst": [],
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.playedAgainst).toEqual(patchEntity.playedAgainst);
			done();
		});
		it('the playedColor attribute', async done => {
			let patchEntity: any = {
				"playedColor": [],
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.playedColor).toEqual(patchEntity.playedColor);
			done();
		});
		it('the results attribute', async done => {
			let patchEntity: any = {
				"results": [],
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.results).toEqual(patchEntity.results);
			done();
		});
		it('the state attribute', async done => {
			let patchEntity: any = {
				"state": PLAYER_STATE.ACTIVE,
			}
			let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, patchEntity);
			expect(response.body.state).toEqual(patchEntity.state);
			done();
		});

	});
})
