import app from './../../index';
import {server} from '../../index';
import {TournamentDto} from "./tournament.model";
import {TOURNAMENT_TYPE} from "../../contants/contants";
let supertest = require("supertest");

describe('Tournament Entity', () => {
	let request: any;
	let entity = '/tournament';
	beforeAll(() => {
		request = supertest(app);
	});
	it('should return a successful response for GET /tournament', done => {
		request.get(entity)
			.expect(200, done);
	});
	it('GET /tournament', function(done) {
		return request
			.get(entity)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((response: any) => {
				// console.log(response);
				expect(response.body).toEqual([])
				done();
			})
			.catch((err: any) => done(err))
	});
	it('POST /tournament', function(done) {
		let tournament: TournamentDto = {
			"id": "string",
			"name": "Tata Steel Chess",
			"city": "Wijk aan Zee",
			"year": 2021,
			"rounds": 6,
			"maxPlayers": 45,
			"type": TOURNAMENT_TYPE.SWISS
		}
		return request
			.post(entity)
			.send(tournament)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201)
			.then((response: any) => {
				console.log('Tournament Entity/POST /tournament: ' + response.body.id);
				expect(response.body.id).toBeTruthy()
				return request
					.get('/tournament/' + response.body.id)
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
						done();
					})
					.catch((err: any) => done(err))
				done();
			})
			.catch((err: any) => done(err))
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
