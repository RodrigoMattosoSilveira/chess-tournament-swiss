import {ROUND_STATE} from "./round.constants";

const request = require('supertest');

import {RoundDto} from "./round.model";
import roundDao from './round.dao';

import app from './../../index';
import { Utils } from "../../utils/utils";
import tournamentDao from "../tournament/tournament.dao";
import userDao from "../user/user.dao";
import {PLAYER_STATE, TOURNAMENT_TYPE} from "../../contants/contants";
import {start} from "repl";

describe('Round Entity', () => {
	describe('DAO Operations', () => {
		let entityDto: RoundDto;
		let tournamentId = "123456";
		let pathRoundId: string;
		let roundEntity: any;
		let roundEntityPatched: any;
		let roundEntities: any;
		it('add', async done => {
			entityDto = {
				id: "ignore",
				tournament: tournamentId,
				number: 1
			}
			pathRoundId = await roundDao.add(entityDto)
			expect(pathRoundId).toBeTruthy();
			done();
		});
		it('getById', async done => {
			roundEntity = await roundDao.getById(pathRoundId)
			expect(roundEntity).toBeTruthy();
			expect(roundEntity.id).toBe(pathRoundId);
			expect(roundEntity.tournament).toBe(tournamentId);
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
			done();
		});
		it('getAll', async done => {
			roundEntities = await roundDao.getAll()
			expect(roundEntities.length).toBe(1);
			roundEntity = roundEntities[0];
			expect(roundEntity.id).toBe(pathRoundId);
			expect(roundEntity.tournament).toBe(tournamentId);
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
			done();
		});
		describe('patchById', () => {
			// Epoch dates for testing
			// https://www.unixtimestamp.com/
			// 1609552800 2021 01 01 18:00:00
			// 1609564889 2021 01 01 21:21:29
			let roundStartEpoch = 1609552800;
			let roundEndEpoch = 1609564889;
			beforeAll(async done => {
				entityDto = {
					id: "ignore",
					tournament: tournamentId,
					number: 1
				}
				pathRoundId = await roundDao.add(entityDto)
				expect(pathRoundId).toBeTruthy();
				done();
			});
			it('state', async done => {
				let entityPatch: any = {
					id: pathRoundId,
					state: ROUND_STATE.UNDERWAY
				}
				await roundDao.patchById(entityPatch);
				roundEntityPatched = await roundDao.getById(pathRoundId)
				expect(roundEntityPatched.id).toBe(pathRoundId);
				expect(roundEntityPatched.state).toBe(ROUND_STATE.UNDERWAY);
				done();
			});
			it('start', async done => {
				let entityPatch: any = {
					id: pathRoundId,
					start: roundStartEpoch
				}
				await roundDao.patchById(entityPatch);
				roundEntityPatched = await roundDao.getById(pathRoundId)
				expect(roundEntityPatched.id).toBe(pathRoundId);
				expect(roundEntityPatched.start).toBe(roundStartEpoch);
				done();
			});
			it('start cannot be patched', async done => {
				let entityPatch: any = {
					id: pathRoundId,
					start: roundStartEpoch + 10
				}
				await roundDao.patchById(entityPatch);
				roundEntityPatched = await roundDao.getById(pathRoundId)
				expect(roundEntityPatched.id).toBe(pathRoundId);
				expect(roundEntityPatched.start).toBe(roundStartEpoch);
				done();
			});
			it('end', async done => {
				let entityPatch: any = {
					id: pathRoundId,
					end: roundEndEpoch
				}
				await roundDao.patchById(entityPatch);
				roundEntityPatched = await roundDao.getById(pathRoundId)
				expect(roundEntityPatched.id).toBe(pathRoundId);
				expect(roundEntityPatched.end).toBe(roundEndEpoch);
				done();
			});
			it('end cannot be patched', async done => {
				let entityPatch: any = {
					id: pathRoundId,
					end: roundEndEpoch + 10
				}
				await roundDao.patchById(entityPatch);
				roundEntityPatched = await roundDao.getById(pathRoundId)
				expect(roundEntityPatched.id).toBe(pathRoundId);
				expect(roundEntityPatched.end).toBe(roundEndEpoch);
				done();
			});
		})
	});
});
