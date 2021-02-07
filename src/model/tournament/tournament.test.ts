import app from './../../index';
import {server} from '../../index';
import {TOURNAMENT_TYPE} from "../../contants/contants";
const request = require('supertest');
import { Utils } from "../../utils/utils";

describe('Tournament Entity', () => {
	const utils = new Utils();
	let resource = '/tournament';
	let response: any;
	it('GET /tournament', async done => {
		response = await request(app)
			.get(resource)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body).toEqual([]);
		done();
	});
	it('POST /tournament', async done =>  {
		let entityDto: any = {
			"name": "Tata Steel Chess",
			"city": "Wijk aan Zee",
			"year": 2021,
			"rounds": 6,
			"maxPlayers": 45,
			"type": TOURNAMENT_TYPE.SWISS
		}

		// POST the entity
		await request(app)
			.post(resource)
			.send(entityDto)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201)
			.then((response: any) => {
				// console.log('Tournament Entity/POST /tournament: ' + response.body.id);
				entityDto.id = response.body.id;
				expect(response.body.id).toBeTruthy()
			})
			.catch((err: any) => done(err));
		
		// GET the entity
		await request(app)
			.get(resource + '/' + entityDto.id)
			.set('Accept', 'application/json')
			.expect(200)
			.then((response: any) => {
				// console.log(response);
				// console.log(response.body);
				expect(response.body.name).toEqual(entityDto.name);
				expect(response.body.city).toEqual(entityDto.city);
				expect(response.body.year).toEqual(entityDto.year);
				expect(response.body.rounds).toEqual(entityDto.rounds);
				expect(response.body.type).toEqual(entityDto.type);
			})
			.catch((err: any) => done(err))
		done();
	});
	describe('PATCH /tournament:id', () => {
		// Create this entity and validate PATCH against it
		/**
		 * MODEL
		 * 	id: string;				// created by the server
			name: string;			// must be unique
			city?: string;
			country?: string;
			month?: number;
			year?: number;
			rounds: number;
			maxPlayers: number;
			type: string; // roundRobin, swiss, elimination, match
			players?: Array<number> // TournamentPlayerDto.id
			state?: string; // planned* / scheduled / closed / underway / complete
		 */
		let entityDto: any = {
			"name": "DSB Congress - 1910",// Must be unique
			"city": "Hamburg",
			"rounds": 12,
			"maxPlayers": 12,
			"type": "round"
		};
		
		// Use it to patch all patchable attributes at once
		let entityPatch: any = {
			"name": "DSB Congress - 1911",// Must be unique
			"city": "Sao Paulo",
			"country": "Brasil",
			"month": 10,
			"year": 1911,
			"rounds": 6,
			"maxPlayers": 13,
			"type": TOURNAMENT_TYPE.SWISS,
			"players": [1234, 2345, 3456, 4567, 5678, 6789],
			"state": "scheduled"
		}
		
		beforeAll(async done => {
			// POST the entity, will validate PATCH against it
			await request(app)
				.post(resource)
				.send(entityPatch)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					// console.log('Tournament Entity/PATCH POST /tournament: ' + response.body.id);
					entityDto.id = response.body.id;
					expect(response.body.id).toBeTruthy()
				})
				.catch((err: any) => done(err));
			done();
		});
		it('patches all patchable attributes', async done => {
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, entityPatch);
			expect(response.body.city).toEqual(entityPatch.city);
			expect(response.body.month).toEqual(entityPatch.month);
			expect(response.body.year).toEqual(entityPatch.year);
			expect(response.body.rounds).toEqual(entityPatch.rounds);
			expect(response.body.maxPlayers).toEqual(entityPatch.maxPlayers);
			expect(response.body.type).toEqual(entityPatch.type);
			expect(response.body.players).toEqual(entityPatch.players);
			expect(response.body.state).toEqual(entityPatch.state);
			done();
		});
	
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
