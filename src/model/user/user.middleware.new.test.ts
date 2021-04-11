import express from 'express';

import { UserMiddleware } from "./user.middleware.new";

import { IUserCreate } from "./user.interfaces";
import * as testDb from "../../utils/test-db";
import shortid from "shortid";
import {USER_CONSTANTS} from "./user.constants";

describe('User Middleware Unit Tests', () => {
	let userMiddleware: UserMiddleware;
	it('User Middleware canonical unit test', async done => {
		expect(1 + 1).toEqual(2);
		done();
	});
	
	beforeAll(async () => {
		userMiddleware = UserMiddleware.getInstance();
	});
	describe('addAttributeDefaults', () => {
		it('as expected', async done => {
			const req: any = {};
			req.body = {};
			userMiddleware.lAddAttributeDefaults(req);
			expect(Object.keys(req.body).sort()).toEqual(["id", "permissionLevel", "rating", "ratingState", "state"].sort());
			expect(req.body.permissionLevel).toEqual(USER_CONSTANTS.DEFAULT_PERMISSION);
			expect(req.body.rating).toEqual(USER_CONSTANTS.DEFAULT_RATING);
			expect(req.body.ratingState).toEqual(USER_CONSTANTS.DEFAULT_RATING_STATE);
			expect(req.body.state).toEqual(USER_CONSTANTS.DEFAULT_STATE);
			done();
		});
	});
});

