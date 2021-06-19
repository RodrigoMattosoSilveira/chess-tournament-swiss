import {UserDto} from "../user/user.model";

const request = require('supertest');

import app from './../../index';
import { Utils } from "../../utils/utils";
import tournamentDao from "../tournament/tournament.dao";
import userDao from "../user/user.dao";
import {PLAYER_STATE, TOURNAMENT_TYPE} from "../../contants/contants";

describe('Player Entity', () => {
	const utils = new Utils();
	let resource = '/player';
	let response: any;
	let tournamentId: string;
	let userId: string;
	let playerId: string;
	let userEntity: any;
	let tournamentEntity: any;
	let playerEntity: any;
	
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
				password: "easytobreak"
			};
			userDao.create(userEntity).fold(
				err => {
					// console.log('\nError creating a user to help POST a player: ' + err + '\n');
					done(err)
				},
				daoOk => {
					let userDao: UserDto = JSON.parse(daoOk.content);
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
				}
			) // 20
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
