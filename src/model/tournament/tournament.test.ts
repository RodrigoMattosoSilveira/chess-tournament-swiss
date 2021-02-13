import app from './../../index';
import {server} from '../../index';
import {TOURNAMENT_STATE, TOURNAMENT_TYPE} from "../../contants/contants";
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
				expect(response.body.id).toBeTruthy();
				done();
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
				expect(response.body.players).toEqual([]);
				expect(response.body.state).toEqual(TOURNAMENT_STATE.PLANNED);
				expect(response.body.win).toEqual(1);
				done();
			})
			.catch((err: any) => done(err))
	});
	describe('PATCH /tournament:id', () => {
		// Create this entity and validate PATCH against it
		let entityDto: any = {
			"name": "DSB Congress - 1910",// Must be unique
			"city": "Hamburg",
			"rounds": 12,
			"maxPlayers": 12,
			"type": TOURNAMENT_TYPE.ROUND_ROBIN
		};
		
		beforeAll(async done => {
			// POST the entity, will validate PATCH against it
			console.log('\nTournament Entity/PATCH beforeAll \n');
			await request(app)
				.post(resource)
				.send(entityDto)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					console.log('\nTournament Entity/PATCH POST /tournament: ' + response.body.id + '\n');
					entityDto.id = response.body.id;
					expect(response.body.id).toBeTruthy()
				})
				.catch((err: any) => {
					console.log('\nTournament Entity/PATCH POST /tournament: ' + err + '\n');
					done(err)
				});
			done();
		});
		it('patches all patchable attributes', async done => {
			
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
				"state": TOURNAMENT_STATE.SCHEDULED,
				"winPoints": 3,
				"tiePoints": 1
			}
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, entityPatch);
			expect(response.body.city).toEqual(entityPatch.city);
			expect(response.body.month).toEqual(entityPatch.month);
			expect(response.body.year).toEqual(entityPatch.year);
			expect(response.body.rounds).toEqual(entityPatch.rounds);
			expect(response.body.maxPlayers).toEqual(entityPatch.maxPlayers);
			expect(response.body.type).toEqual(entityPatch.type);
			expect(response.body.players).toEqual(entityPatch.players);
			expect(response.body.state).toEqual(entityPatch.state);
			expect(response.body.winPoints).toEqual(3);
			expect(response.body.tiePoints).toEqual(1);
			done();
		});
		
		it('PATCH /tournament:id city', async done => {
			const patchMe = {"city": "Campinas"};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.city).toEqual(patchMe.city);
			done();
		});
		
		it('PATCH /tournament:id month', async done => {
			const patchMe = {"month": 7};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.month).toEqual(patchMe.month);
			done();
		});
		
		it('PATCH /tournament:id year', async done => {
			const patchMe = {"year": 1912};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.year).toEqual(patchMe.year);
			done();
		});
		
		it('PATCH /tournament:id rounds', async done => {
			const patchMe = {"rounds": 1912};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.rounds).toEqual(patchMe.rounds);
			done();
		});
		
		it('PATCH /tournament:id maxPlayers', async done => {
			const patchMe = {"maxPlayers": 21};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.maxPlayers).toEqual(patchMe.maxPlayers);
			done();
		});
		
		it('PATCH /tournament:id type', async done => {
			const patchMe = {"type": TOURNAMENT_TYPE.ELIMINATION};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.type).toEqual(patchMe.type);
			done();
		});
		
		it('PATCH /tournament:id players', async done => {
			const patchMe = {"players": [1234, 2345, 3456]};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.players).toEqual(patchMe.players);
			done();
		});
		
		it('PATCH /tournament:id state', async done => {
			const patchMe = {"state": TOURNAMENT_STATE.CLOSED};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.state).toEqual(patchMe.state);
			done();
		});
		
		it('PATCH /tournament:id winPoints', async done => {
			const patchMe = {"winPoints": 2};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.winPoints).toEqual(patchMe.winPoints);
			done();
		});
		
		it('PATCH /tournament:id tiePoints', async done => {
			const patchMe = {"tiePoints": 1.5};
			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.tiePoints).toEqual(patchMe.tiePoints);
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
