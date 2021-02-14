const request = require('supertest');

import app from './../../index';
import {server} from '../../index';
import { Utils } from "../../utils/utils";
import tournamentDao from "../tournament/tournament.dao";
import { UserDto } from "../user/user.model";
import userDao from "../user/user.dao";
import {TournamentDto} from "../tournament/tournament.model";
import {PlayerDto} from "./player.model";
import {TOURNAMENT_STATE, TOURNAMENT_TYPE} from "../../contants/contants";

describe('Player Entity', () => {
	const utils = new Utils();
	let resource = '/tournament';
	let response: any;
	let tournamentId: string;
	let userId: string;
	let playerId: string;
	let userEntity: any;
	let tournamentEntity: any;
	
	describe('Player Entity GET /player', () => {
		it('GET /player', async done => {
			response = await request(app)
				.get(resource)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					expect(response.body).toEqual([]);
					done();
				})
				.catch((err: any) => {
					// console.log('\nGET /player: ' + err + '\n');
					done(err)
				});
			done();
		})
	});
	describe('Player Entity POST /player and GET /player/:id', () => {
		beforeAll(async done => {
			// creat a valid user - we are not testing tournaments
			userEntity = {
				email: "a.b@c.com",
				password: "easytobreak"
			}
			
			//	create a valid tournament - we are not testing tournaments
			tournamentEntity = {
				name: "Blanchard Open - 2021",
				maxPlayers: 32,
				rounds: 6,
				type: TOURNAMENT_TYPE.SWISS
			}
			userDao.addUser(userEntity)
				.then((id: string) => {
					userId = id;
					// console.log('\nPlayer Entity POST/beforeAll/POST user: ' + userId + '\n');
					tournamentDao.add(tournamentEntity)
						.then((id: string) => {
							tournamentId = id;
							// console.log('\nPlayer Entity POST/beforeAll/POST tournament: ' + tournamentId + '\n');
							done();
						})
						.catch((err: any) => {
							// console.log('\nPlayer Entity POST/beforeAll/POST tournament: ' + err + '\n');
							done(err)
						});
				})
				.catch((err: any) => {
					// console.log('\nPlayer Entity POST/beforeAll/POST user: ' + err + '\n');
					done(err)
				});
		});
		it('POST /player - valid', async done => {
			let playerDto: PlayerDto = {
				id: "none",
				user: userId,
				tournament: tournamentId
			}
			request(app)
				.post("/player")
				.send(playerDto)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					// console.log('\Player Entity/POST /player: ' + response.body.id + '\n');
					expect(response.body.id).toBeTruthy()
					playerId = response.body.id;
					done();
				})
				.catch((err: any) => {
					// console.log('\nPOST /player - valid: ' + err + '\n');
					done(err)
				});
			response = await request(app)
				.get("/player/" + playerId)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					console.log('\nPlayer Entity/POST GET /player/ ' + response.body.id + '\n');
					expect(response.body.id).toEqual(playerId);
					expect(response.body.user).toEqual(userId);
					expect(response.body.tournament).toEqual(tournamentId);
					expect(response.body.hadByeOrForfeit).toEqual(false);
					expect(response.body.byeNextRound).toEqual(false);
					expect(response.body.playedAgainst).toEqual([]);
					expect(response.body.playedColor).toEqual([]);
					expect(response.body.results).toEqual([]);
					expect(response.body.state).toEqual(TOURNAMENT_STATE.SCHEDULED);
					done();
				})
				.catch((err: any) => {
					// console.log('\nGET /player: ' + err + '\n');
					done(err)
				});
			done();
		});
	})
	// describe('Player Entity PATCH /player:id', () => {
	// 	// Create this entity and validate PATCH against it
	// 	// creat a valid user - we are not testing tournaments
	// 	userEntity = {
	// 		email: "a.b@c.com",
	// 		password: "easytobreak"
	// 	}
	//
	// 	//	create a valid tournament - we are not testing tournaments
	// 	tournamentEntity = {
	// 		name: "Blanchard Open - 2021",
	// 		maxPlayers: 32,
	// 		rounds: 6,
	// 		type: TOURNAMENT_TYPE.SWISS
	// 	}
	// 	let playerEntity: any = {
	// 		user: userId,
	// 		tournament: tournamentId
	// 	}
	// 	beforeAll(async done => {
	// 		// create a user
	// 		userDao.addUser(userEntity)
	// 			.then((id: string) => {
	// 				userId = id;
	// 				// console.log('\nPlayer Entity POST/beforeAll/POST user: ' + userId + '\n');
	//
	// 				// Create a tournament
	// 				tournamentDao.add(tournamentEntity)
	// 					.then((id: string) => {
	// 						tournamentId = id;
	// 						// console.log('\nPlayer Entity POST/beforeAll/POST tournament: ' + tournamentId + '\n');
	//
	// 						// Create a game
	// 						request(app)
	// 							.post("/player")
	// 							.send(playerEntity)
	// 							.set('Accept', 'application/json')
	// 							.expect('Content-Type', /json/)
	// 							.expect(201)
	// 							.then((response: any) => {
	// 								console.log('\nPlayer Entity PATCH /player:id Entity/POST /player: ' + response.body.id + '\n');
	// 								expect(response.body.id).toBeTruthy()
	// 								playerId = response.body.id;
	// 								done();
	// 							})
	// 							.catch((err: any) => {
	// 								console.log('\nPlayer Entity PATCH /player:id POST /player - valid: ' + err + '\n');
	// 								done(err)
	// 							});
	// 						done();
	// 					})
	// 					.catch((err: any) => {
	// 						// console.log('\nPlayer Entity POST/beforeAll/POST player: ' + err + '\n');
	// 						done(err)
	// 					});
	//
	// 			})
	// 			.catch((err: any) => {
	// 				// console.log('\nPlayer Entity POST/beforeAll/POST user: ' + err + '\n');
	// 				done(err)
	// 			});
	// 	})
	// 	it('patches all patchable attributes', async done => {
	// 		let entityPatch: any = {
	// 			hadByeOrForfeit: true,      // True after player had a bye or was awarded a forfeit
	// 			byeNextRound: true,         // True if player is scheduled for next round bye
	// 			playedAgainst: [""],  // Players (not users)
	// 			playedColor: [-1],    // -1=Black, 1=White
	// 			results: [1]        // -1 = loss, 0.5=tie, 1=win
	// 		}
	// 		console.log('\npatches all patchable attributes: ' + JSON.stringify(entityPatch) + '\n');
	// 		let response = await utils.patchEntity(request(app), "/player" + '/' + playerId, entityPatch);
	// 		expect(response.body.hadByeOrForfeit).toEqual(entityPatch.hadByeOrForfeit);
	// 	});
	// });
})
