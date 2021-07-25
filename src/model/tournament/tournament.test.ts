import express from 'express';
import http from "http";
const request = require('supertest');

import {TOURNAMENT_STATE, TOURNAMENT_TYPE} from "../../contants/contants";
import { Utils } from "../../utils/utils";
import {
	createExpressApp,
	createHttpServer,
	mongoDbInMemory,
	expressApplicationShutDown,
	mongoInMemoryShutDown
} from "../../server/server";

describe('Tournament Entity', () => {
	const utils = new Utils();
	let resource = '/tournament';
	let response: any;
	let expressApplication: express.Application;
	let httpServer: http.Server;

	beforeAll(async (done) => {
		expressApplication = createExpressApp();
		httpServer = createHttpServer(expressApplication);
		mongoDbInMemory(expressApplication);
		done();
	})
	it('GET /tournament', async done => {
		response = await request(httpServer)
			.get(resource)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(Array.isArray(response.body)).toEqual(true);
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
		await request(httpServer)
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
		await request(httpServer)
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
				expect(response.body.state).toEqual(TOURNAMENT_STATE.SCHEDULED);
				expect(response.body.win).toEqual(1);
				done();
			})
			.catch((err: any) => done(err))
	});
	describe('PATCH /tournament:id', () => {
		// Create this entity and validate PATCH against it
		let entityDto: any = {
			"name": "DSB Congress - 1710",// Must be unique
			"city": "Hamburg",
			"rounds": 12,
			"maxPlayers": 12,
			"type": TOURNAMENT_TYPE.ROUND_ROBIN
		};
		
		beforeAll(async done => {
			// POST the entity, will validate PATCH against it
			console.log('\nTournament Entity/PATCH beforeAll \n');
			await request(httpServer)
				.post(resource)
				.send(entityDto)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					console.log('\nTournament Entity/PATCH POST /tournament: ' + response.body.id + '\n');
					entityDto.id = response.body.id;
					expect(response.body.id).toBeTruthy();
					done();
				})
				.catch((err: any) => {
					console.log('\nTournament Entity/PATCH POST /tournament: ' + err + '\n');
					done(err)
				});
			done();
		});
		it('PATCH /tournament:id city', async done => {
			const patchMe = {"city": "Campinas"};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.city).toEqual(patchMe.city);
			done();
		});
		
		it('PATCH /tournament:id month', async done => {
			const patchMe = {"month": 7};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.month).toEqual(patchMe.month);
			done();
		});
		
		it('PATCH /tournament:id year', async done => {
			const patchMe = {"year": 1912};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.year).toEqual(patchMe.year);
			done();
		});
		
		it('PATCH /tournament:id rounds', async done => {
			const patchMe = {"rounds": 1912};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.rounds).toEqual(patchMe.rounds);
			done();
		});
		
		it('PATCH /tournament:id maxPlayers', async done => {
			const patchMe = {"maxPlayers": 21};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.maxPlayers).toEqual(patchMe.maxPlayers);
			done();
		});
		
		it('PATCH /tournament:id type', async done => {
			const patchMe = {"type": TOURNAMENT_TYPE.ELIMINATION};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.type).toEqual(patchMe.type);
			done();
		});
		
		it('PATCH /tournament:id players', async done => {
			const patchMe = {"players": [1234, 2345, 3456]};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.players).toEqual(patchMe.players);
			done();
		});
		
		it('PATCH /tournament:id state', async done => {
			const patchMe = {"state": TOURNAMENT_STATE.COMPLETE};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.state).toEqual(patchMe.state);
			done();
		});
		
		it('PATCH /tournament:id winPoints', async done => {
			const patchMe = {"winPoints": 2};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.winPoints).toEqual(patchMe.winPoints);
			done();
		});
		
		it('PATCH /tournament:id tiePoints', async done => {
			const patchMe = {"tiePoints": 1.5};
			let response = await utils.patchEntity(request(httpServer), resource + '/' + entityDto.id, patchMe);
			expect(response.body.tiePoints).toEqual(patchMe.tiePoints);
			done();
		});
	});

	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	afterAll(async (done) => {
		mongoInMemoryShutDown();
		expressApplicationShutDown();
		done()
	})
});
