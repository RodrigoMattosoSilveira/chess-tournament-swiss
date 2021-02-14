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
	let userEntity: UserDto;
	let tournamentEntity: TournamentDto;
	describe('Player Entity GET', () => {
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
					console.log('\nGET /player: ' + err + '\n');
					done(err)
				});
			done();
		})
	});
	describe('Player Entity POST /', () => {
		beforeAll(async done => {
			// creat a valid user - we are not testing tournaments
			userEntity = {
				id: "none",
				email: "a.b@c.com",
				password: "easytobreak"
			}
			userDao.addUser(userEntity)
				.then((id: string) => {
					userId = id;
					console.log('\nPlayer Entity POST/beforeAll/POST user: ' + userId + '\n');
					done();
				})
				.catch((err: any) => {
					console.log('\nPlayer Entity POST/beforeAll/POST user: ' + err + '\n');
					done(err)
				});
			
			//	create a valid tournament - we are not testing tournaments
			tournamentEntity = {
				id: "none",
				name: "Blanchard Open - 2021",
				maxPlayers: 32,
				rounds: 6,
				type: TOURNAMENT_TYPE.SWISS
			}
			tournamentDao.add(tournamentEntity)
				.then((id: string) => {
					tournamentId = id;
					console.log('\nPlayer Entity POST/beforeAll/POST tournament: ' + tournamentId + '\n');
					done();
				})
				.catch((err: any) => {
					console.log('\nPlayer Entity POST/beforeAll/POST tournament: ' + err + '\n');
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
					console.log('\nTournament Entity/POST /player: ' + response.body.id + '\n');
					expect(response.body.id).toBeTruthy()
					playerId = response.body.id;
					done();
				})
				.catch((err: any) => {
					console.log('\nPOST /player - valid: ' + err + '\n');
					done(err)
				});
			response = await request(app)
				.get("/player/:" + playerId)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					console.log('\nTournament Entity/PATCH POST /tournament: ' + response.body.id + '\n');
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
					console.log('\nGET /player: ' + err + '\n');
					done(err)
				});
			done();
		});
	})
})
