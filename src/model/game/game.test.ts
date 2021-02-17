const request = require('supertest');

import app from './../../index';
import { Utils } from "../../utils/utils";
import userService from "../user/user.service";
import tournamentService from "../tournament/tournament.service";
import playerService from "../player/player.service"
import tournamentDao from "../tournament/tournament.dao";
import userDao from "../user/user.dao";
import {PLAYER_STATE, TOURNAMENT_TYPE} from "../../contants/contants";

describe('Game Entity', () => {
	const utils = new Utils();
	let resource = '/game';
	let response: any;
	let tournamentId: string;
	let userId_1: string;
	let userId_2: string;
	let playerId_1: string;
	let playerId_2: string;
	let gameId: string;
	let userEntity_1: any;
	let userEntity_2: any;
	let tournamentEntity: any;
	let playerEntity_1: any;
	let playerEntity_2: any;
	let gameEntity: any;
	let gamePatch: any;
	beforeAll(async done => {
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
	// Appended  the `-`
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
})
