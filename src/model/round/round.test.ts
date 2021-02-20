// const request = require('supertest');

import {RoundDto} from "./round.model";
import roundDao from './round.dao';
import roundService from './round.service';
import {ROUND_STATE} from "./round.constants";


// import app from './../../index';
// import { Utils } from "../../utils/utils";
// import tournamentDao from "../tournament/tournament.dao";
// import userDao from "../user/user.dao";
// import {PLAYER_STATE, TOURNAMENT_TYPE} from "../../contants/contants";
// import {start} from "repl";

describe('Round Entity', () => {
	let entityDto: RoundDto;
	let createdEntityDto: RoundDto;
	let entityDtoId: string;
	let tournamentId = "123456";
	let roundEntity: any;
	let patchedEntityDto: any;
	let entityCollection: any;
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
	})
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
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
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
			it('start', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					start: roundStartEpoch
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.start).toBe(roundStartEpoch);
				done();
			});
			it('start cannot be patched', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					start: roundStartEpoch + 10
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.start).toBe(roundStartEpoch);
				done();
			});
			it('end', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					end: roundEndEpoch
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.end).toBe(roundEndEpoch);
				done();
			});
			it('end cannot be patched', async done => {
				let entityPatch: any = {
					id: patchEntityId,
					end: roundEndEpoch + 10
				}
				await roundDao.patchById(entityPatch);
				patchedEntityDto = await roundDao.getById(patchEntityId)
				expect(patchedEntityDto.id).toBe(patchEntityId);
				expect(patchedEntityDto.end).toBe(roundEndEpoch);
				done();
			});
		})
	});
});
