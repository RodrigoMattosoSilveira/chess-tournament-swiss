import express from 'express';

import { UserMiddleware } from "./user.middleware.new";
import {isValidEmail} from "../../utils/utils";
import userDao from './user.dao';
jest.mock('./user.dao');

import { IUserCreate, IUserPatch } from "./user.interfaces";
import * as testDb from "../../utils/test-db";
import shortid from "shortid";
import {EMAIL_VALIDATION, USER_DEFAULT_CONSTANTS, USER_RATING_STATE, USER_STATE, USER_PERMISSION} from "./user.constants";

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
			expect.assertions(5);
			userMiddleware.lAddAttributeDefaults(req);
			expect(Object.keys(req.body).sort()).toEqual(["id", "permissionLevel", "rating", "ratingState", "state"].sort());
			expect(req.body.permissionLevel).toEqual(USER_DEFAULT_CONSTANTS.PERMISSION);
			expect(req.body.rating).toEqual(USER_DEFAULT_CONSTANTS.RATING);
			expect(req.body.ratingState).toEqual(USER_DEFAULT_CONSTANTS.RATING_STATE);
			expect(req.body.state).toEqual(USER_DEFAULT_CONSTANTS.STATE);
			done();
		});
	});
	describe('createEmailIsValid', () => {
		it('invalid email', async done => {
			const inValidEmail: string = "a.b@c";
			expect.assertions(1);
			expect(isValidEmail(inValidEmail)).toEqual(false);
			done();
		})
		it('valid email', async done => {
			const validEmail: string = "a.b@c.com";
			expect.assertions(1);
			expect(isValidEmail(validEmail)).toEqual(true);
			done();
		})
		it('valid email & unique email', async done => {
			let email: string = "a.b@c.com";
			// userDao.emailExists = jest.fn(email =>  Promise.resolve(false));
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(Promise.resolve(false));
			expect(await userMiddleware.lCreateEmailIsValid(email)).toEqual(EMAIL_VALIDATION.VALID);
			done();
		})
		it('valid email & existing email', async done => {
			let email: string = "a.b@c.com";
			// userDao.emailExists = jest.fn(email =>  Promise.resolve(true));
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(Promise.resolve(true));
			expect(await userMiddleware.lCreateEmailIsValid(email)).toEqual(EMAIL_VALIDATION.ALREADY_EXISTS);
			done();
		})
		it('invalid email & unique email', async done => {
			let email: string = "a.b@c";
			// userDao.emailExists = jest.fn(email =>  Promise.resolve(false));
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(Promise.resolve(false));
			expect(await userMiddleware.lCreateEmailIsValid(email)).toEqual(EMAIL_VALIDATION.INVALID);
			done();
		})
		it('invalid email & existing email', async done => {
			let email: string = "a.b@c";
			// userDao.emailExists = jest.fn(email =>  Promise.resolve(true));
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(Promise.resolve(true));
			expect(await userMiddleware.lCreateEmailIsValid(email)).toEqual(EMAIL_VALIDATION.INVALID);
			done();
		})
	});
	describe('entity existence', () => {
		it('non existing entity', async done => {
			let id: string = "existing_user_id";
			// @ts-ignore
			userDao.idExists.mockResolvedValue(Promise.resolve(false));
			expect(await userMiddleware.lEntityExists(id)).toEqual(false);
			expect(userDao.idExists).toHaveBeenCalled();
			expect(userDao.idExists).toHaveBeenCalledWith(id);
			done();
		});
		it('non existing entity', async done => {
			let id: string = "non_existing_user_id";
			// @ts-ignore
			userDao.idExists.mockResolvedValue(Promise.resolve(true));
			expect(await userMiddleware.lEntityExists(id)).toEqual(true);
			expect(userDao.idExists).toHaveBeenCalled();
			expect(userDao.idExists).toHaveBeenCalledWith(id);
			done();
		});
	});
	describe('required create attributes', () => {
		it('are present', async done => {
			let body: IUserCreate = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userMiddleware.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("");
			done();
		});
		it('the email is missing', async done => {
			let body: any = {
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userMiddleware.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("email");
			done();
		});
		it('the first name is missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userMiddleware.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("firstName");
			done();
		});
		it('the last name is missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				firstName: "John",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userMiddleware.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("lastName");
			done();
		});
		it('the password is missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
			}
			let missingAttributes = userMiddleware.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("password");
			done();
		});
		it('the first name and the password are missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				lastName: "White",
			}
			let missingAttributes = userMiddleware.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("firstName, password");
			done();
		});
	});
	describe('only required create attributes', () => {
		it('Ok when only required attributes', async done => {
			let body: IUserCreate = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			let errorMessage = userMiddleware.lHasOnlyRequiredCreateAttributes(body)
			expect(errorMessage).toEqual("");
			done();
		});
		it('Fail when one extraneous attribute', async done => {
			let body: any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut",
				extraneous: "attribute"
			}
			let errorMessage = userMiddleware.lHasOnlyRequiredCreateAttributes(body)
			expect(errorMessage).toEqual("extraneous");
			done();
		})
		
	});
	describe('patchable attributes', () => {
		it('all valid patchable attributes present', async done => {
			let body: IUserPatch = {
				email:"a.b@c.com",
				firstName: "Paul",
				lastName: "White",
				password: "ThoughToFigureOut",
				permissionLevel: USER_PERMISSION.USER,
				rating: 1567,
				state: USER_STATE.ACTIVE
			}
			let invalidPatchAttributes = userMiddleware.lHasValidPatchAttributes(body)
			expect(invalidPatchAttributes).toEqual("");
			done();
		});
		it('invalid patchable attribute present', async done => {
			let body:any = {
				email:"a.b@c.com",
				firstName: "Paul",
				lastName: "White",
				id: "invalid id",
				password: "ThoughToFigureOut",
				permissionLevel: USER_PERMISSION.USER,
				rating: 1567,
				state: USER_STATE.ACTIVE
			}
			let invalidPatchAttributes = userMiddleware.lHasValidPatchAttributes(body)
			expect(invalidPatchAttributes).toEqual("id");
			done();
		});
		
	})
});

