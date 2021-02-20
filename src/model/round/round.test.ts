import {ROUND_STATE} from "./round.constants";

const request = require('supertest');

import {RoundDto} from "./round.model";
import roundDao from './round.dao';

import app from './../../index';
import { Utils } from "../../utils/utils";
import tournamentDao from "../tournament/tournament.dao";
import userDao from "../user/user.dao";
import {PLAYER_STATE, TOURNAMENT_TYPE} from "../../contants/contants";

describe('Round Entity', () => {
	describe('DAO Operations', () => {
		let tournamentId = "123456";
		let roundId: string;
		let roundEntity: any;
		let roundEntityPatched: any;
		let roundEntities: any;
		it('add', async done => {
			let entity: RoundDto = {
				id: "ignore",
				tournament: tournamentId,
				number: 1
			}
			roundId = await roundDao.add(entity)
			expect(roundId).toBeTruthy();
			done();
		});
		it('getById', async done => {
			roundEntity = await roundDao.getById(roundId)
			expect(roundEntity).toBeTruthy();
			expect(roundEntity.id).toBe(roundId);
			expect(roundEntity.tournament).toBe(tournamentId);
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
			done();
		});
		it('getAll', async done => {
			roundEntities = await roundDao.getAll()
			expect(roundEntities.length).toBe(1);
			roundEntity = roundEntities[0];
			expect(roundEntity.id).toBe(roundId);
			expect(roundEntity.tournament).toBe(tournamentId);
			expect(roundEntity.state).toBe(ROUND_STATE.SCHEDULED);
			done();
		});
		describe('patchById', () => {
			it('number', async done => {
				let entityPatch: any = {
					state: ROUND_STATE.UNDERWAY
				}
				await roundDao.patchById(entityPatch);
				roundEntityPatched = await roundDao.getById(roundId)
				expect(roundEntityPatched.id).toBe(roundId);
				expect(roundEntity.state).toBe(ROUND_STATE.UNDERWAY);
				done();
			});
		})

	});
});
