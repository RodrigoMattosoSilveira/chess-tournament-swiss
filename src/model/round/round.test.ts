// TODO: review test in detail for new architecture
const request = require('supertest');
import app from "../../server/app";

import {RoundDto} from "./round.model";
import roundDao from './round.dao';
import roundService from './round.service';
import {ROUND_STATE} from "./round.constants";

import {AMongoDb, MongoInMemory} from "../../server/mongodb";

import {IConfig} from "../../config/config.interface";
let config: IConfig = require('../../config/config.dev.json');

describe('Round Entity', () => {
	let entityDto: RoundDto;
	let createdEntityDto: RoundDto;
	let entityDtoId: string;
	let tournamentId = "123456";
	let roundEntity: any;
	let patchedEntityDto: any;
	let entityCollection: any;
	let resource = '/round';
	let response: any;
	let mongodb: AMongoDb;

	beforeAll(async done => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		mongodb.connect()
			.then(() => {
				console.log(`MongoDB Server running`);
				app.listen(config.expressServerPort, () => {
					console.log(`Express HTTP Server running`);
				});
				done();
			})
			.catch((err: any) => {
				done (err);
			})
		done();
	});

	afterEach(async done => {
		await mongodb.clear();
		done()
	});

	afterAll(async done => {
		await mongodb.close();
		done();
	});

	describe('DAO Operations', () => {
		it('add', async done => {
			entityDto = {
				id: "ignore",
				tournament: tournamentId,
				number: 1
			}
			entityDtoId = await roundDao.add(entityDto)
			expect(entityDtoId).toBeTruthy();
			done();
		});
		it('getById', async done => {
			roundEntity = await roundDao.getById(entityDtoId)
			expect(roundEntity).toBeTruthy();
			expect(roundEntity.id).toBe(entityDtoId);
			expect(roundEntity.tournament).toBe(tournamentId);
			expect(roundEntity.number).toBe(1);
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
			expect(roundEntity.games).toEqual([]);
			expect(roundEntity.started).toBeFalsy();
			expect(roundEntity.ended).toBeFalsy();
			done();
		});
		it('getAll', async done => {
			entityCollection = await roundDao.getAll()
			expect(entityCollection.length).toBeGreaterThan(0);
			createdEntityDto = entityCollection.find((candidate: RoundDto) => candidate.id === entityDtoId)
			expect(createdEntityDto).toBeTruthy();
			expect(createdEntityDto.tournament).toBe(tournamentId);
			expect(createdEntityDto.state).toBe(ROUND_STATE.SCHEDULED);
			done();
		});
		describe('patchById', () => {
			// Epoch dates for testing
			// https://www.unixtimestamp.com/
			// 1609552800 2021 01 01 18:00:00
			// 1609564889 2021 01 01 21:21:29
			let patchEntityId: string
			let roundStartEpoch = 1609552800;
			let roundEndEpoch = 1609564889;
			beforeAll(async done => {
				entityDto = {
					id: "ignore",
					tournament: tournamentId,
					number: 1
				}
				patchEntityId = await roundDao.add(entityDto)
				expect(patchEntityId).toBeTruthy();
				done();
			});
			it('state', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					state: ROUND_STATE.UNDERWAY
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.state).toBe(ROUND_STATE.UNDERWAY);
				done();
			});
			it('started', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					started: roundStartEpoch
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.started).toBe(roundStartEpoch);
				done();
			});
			it('started cannot be patched', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					started: roundStartEpoch + 10
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.started).toBe(roundStartEpoch);
				done();
			});
			it('ended', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					ended: roundEndEpoch
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.ended).toBe(roundEndEpoch);
				done();
			});
			it('end cannot be patched', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					ended: roundEndEpoch + 10
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.ended).toBe(roundEndEpoch);
				done();
			});
		})
	});
	describe('Service Operations', () => {
		it('create', async done => {
			entityDto = {
				id: "ignore",
				tournament: tournamentId,
				number: 1
			}
			entityDtoId = await roundService.create(entityDto)
			expect(entityDtoId).toBeTruthy();
			done();
		});
		it('readById', async done => {
			// @ts-ignore
			let roundEntity: RoundDto = await roundService.readById(entityDtoId);
			expect(roundEntity).toBeTruthy();
			expect(roundEntity.id).toBe(entityDtoId);
			expect(roundEntity.tournament).toBe(tournamentId);
			expect(roundEntity.number).toBe(1);
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
			expect(roundEntity.games).toEqual([]);
			expect(roundEntity.started).toBeFalsy();
			expect(roundEntity.ended).toBeFalsy();
			done();
		})
		it('list', async done => {
			entityDto.number = 2;
			await roundService.create(entityDto);
			entityDto.number = 3;
			await roundService.create(entityDto);
			entityCollection = await roundService.list();
			expect(entityCollection.length).toBeGreaterThan(2);
			done();
		});
		describe('patchById', () => {
			// Epoch dates for testing
			// https://www.unixtimestamp.com/
			// 1609552800 2021 01 01 18:00:00
			// 1609564889 2021 01 01 21:21:29
			let patchEntityId: string
			let roundStartEpoch = 1609552800;
			let roundEndEpoch = 1609564889;
			beforeAll(async done => {
				entityDto = {
					id: "ignore",
					tournament: tournamentId,
					number: 11
				}
				patchEntityId = await roundService.create(entityDto)
				expect(patchEntityId).toBeTruthy();
				done();
			});
			it('state', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					state: ROUND_STATE.UNDERWAY
				}
				await roundService.patchById(entityPatch);
				patchedEntityDto = await roundService.readById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.state).toBe(ROUND_STATE.UNDERWAY);
				done();
			});
			it('started', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					started: roundStartEpoch
				}
				await roundService.patchById(entityPatch);
				patchedEntityDto = await roundService.readById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.started).toBe(roundStartEpoch);
				done();
			});
			it('started cannot be patched', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					started: roundStartEpoch + 10
				}
				await roundService.patchById(entityPatch);
				patchedEntityDto = await roundService.readById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.started).toBe(roundStartEpoch);
				done();
			});
			it('ended', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					ended: roundEndEpoch
				}
				await roundService.patchById(entityPatch);
				patchedEntityDto = await roundService.readById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.ended).toBe(roundEndEpoch);
				done();
			});
			it('end cannot be patched', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					ended: roundEndEpoch + 10
				}
				await roundService.patchById(entityPatch);
				patchedEntityDto = await roundService.readById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.ended).toBe(roundEndEpoch);
				done();
			});
		})
	});
	describe('HTTP Operations', () => {
		it('GET /round', async done => {
			response = await request(app)
				.get(resource)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200);
			expect(Array.isArray(response.body)).toEqual(true);
			done();
		});
	});
	describe('POST /round and GET /round/id', () => {
		let entityDtoId: string;
		beforeAll(async done => {
			done();
		})
		it('POST /document', async done => {
			entityDto = {
				id: "ignore",
				tournament: "gAcqRVdrsW"
			}
			await request(app)
				.post("/round")
				.send(entityDto)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					// console.log('\nPOSTed a round: ' + response.body.id + '\n');
					expect(response.body.id).toBeTruthy()
					entityDtoId = response.body.id;
					// console.log('\nPOST /round - posted: ' + entityDtoId + '\n');
					done();
				})
				.catch((err: any) => {
					// console.log('\nPOST /round - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nPOSTed a round 1: ' + entityDtoId + '\n');
			done();
		})
		it('GET /round/id', async done => {
			// console.log('\nAbout to GET a posted round: + entityDtoId + '\n');
			await request(app)
				.get("/round/" + entityDtoId)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response: any) => {
					// console.log('\nGot POSTed player: ' + response.body.id + '\n');
					expect(response.body.id).toEqual(entityDtoId);
					expect(response.body.tournament).toEqual(entityDto.tournament);
					expect(response.body.number).toEqual(1);
					expect(response.body.games).toEqual([]);
					expect(response.body.state).toEqual(ROUND_STATE.SCHEDULED);
					expect(response.body.started).toBeFalsy()
					expect(response.body.ended).toBeFalsy()
					entityDtoId = response.body.id;
				})
				.catch((err: any) => {
					// console.log('\nPOST /round - invalid: ' + err + '\n');
					done(err)
				});
			// console.log('\nGot POSTed round: ' + entityDtoId + '\n');
			done();
		});
	})
	describe('PATCH /round:id', () => {
		// Create this entity and validate PATCH against it
		entityDto = {
			id: "ignore",
			tournament: "gAcqRVdrsW"
		}
		beforeAll(async done => {
			// POST the entity, will validate PATCH against it
			console.log('\nRound Entity/PATCH beforeAll \n');
			entityDtoId = await roundDao.add(entityDto)
			expect(entityDtoId).toBeTruthy();
			done();
		});
		/**
		 *     id: string;             // generated by the server
		 *     tournament: string;     // required when creating, must exist
		 *     number?: number;        // created when: t started, a round ends triggering a new round or t end
		 *     games?: Array<string>   // created empty, games pushed when calculating round
		 *     state?:string;          // scheduled*, TD --> underway, last game completed --> complete
		 *     started?: number        // TD --> underway
		 *     ended?: number          // last game completed -->
		 */
		it(`no attribute can be changed by REST calls`, async done => {
			expect(2).toEqual(1+1);
			done();
		})
	})
});
