import app from './../../index';
import {server} from '../../index';
import {TournamentDto} from "./tournament.model";
import {TOURNAMENT_TYPE} from "../../contants/contants";
const request = require('supertest');

describe('Tournament Entity', () => {
	let entity = '/tournament';
	let response: any;
	it('GET /tournament', async done => {
		response = await request(app)
			.get(entity)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body).toEqual([]);
		done();
	});
	it('POST /tournament', async done =>  {
		let tournament: any = {
			"name": "Tata Steel Chess",
			"city": "Wijk aan Zee",
			"year": 2021,
			"rounds": 6,
			"maxPlayers": 45,
			"type": TOURNAMENT_TYPE.SWISS
		}

		// Post the entity
		await request(app)
			.post(entity)
			.send(tournament)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201)
			.then((response: any) => {
				// console.log('Tournament Entity/POST /tournament: ' + response.body.id);
				tournament.id = response.body.id;
				expect(response.body.id).toBeTruthy()
			})
			.catch((err: any) => done(err))
		await request(app)
			.get('/tournament/' +tournament.id)
			.set('Accept', 'application/json')
			.expect(200)
			.then((response: any) => {
				// console.log(response);
				// console.log(response.body);
				expect(response.body.name).toEqual(tournament.name);
				expect(response.body.city).toEqual(tournament.city);
				expect(response.body.year).toEqual(tournament.year);
				expect(response.body.rounds).toEqual(tournament.rounds);
				expect(response.body.type).toEqual(tournament.type);
			})
			.catch((err: any) => done(err))
		done();
	});

	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	afterAll(async (done) => {
		await server.close() // CLOSE THE SERVER CONNECTION
		await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // PLUS THE HACK PROVIDED BY @yss14
		done()
	})
});
