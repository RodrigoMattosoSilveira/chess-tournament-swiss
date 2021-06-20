import express from 'express';
import {Ok, Err, Result} from 'space-monad';
import { UserUtil } from "./user.util";
import * as utils from "../../utils/utils";
import userDao from './user.dao';
jest.mock('./user.dao');

import { IUserCreate, IUserPatch } from "./user.interfaces";
import * as testDb from "../../utils/test-db";
import shortid from "shortid";
import {EMAIL_VALIDATION, USER_DEFAULT_CONSTANTS, USER_RATING_STATE, USER_STATE, USER_ROLE} from "./user.constants";

describe('User Middleware Unit Tests', () => {
	let userUtil: UserUtil;
	it('User Middleware canonical unit test', async done => {
		expect(1 + 1).toEqual(2);
		done();
	});
	
	beforeAll(async () => {
		userUtil = UserUtil.getInstance();
	});
	describe('createEmailIsValid', () => {
		it('invalid email', async done => {
			const inValidEmail: string = "a.b@c";
			expect.assertions(1);
			expect(utils.isValidEmail(inValidEmail)).toEqual(false);
			done();
		})
		it('valid email', async done => {
			const validEmail: string = "a.b@c.com";
			expect.assertions(1);
			expect(utils.isValidEmail(validEmail)).toEqual(true);
			done();
		})
		it('valid email email w/ unique email', async done => {
			let email: string = "a.b@c.com";
			// userDao.emailExists = jest.fn(email =>  Promise.resolve(false));
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(false);
			expect(await userUtil.lEmailExists(email)).toEqual(false);
			done();
		})
		it('valid email w/ existing email', async done => {
			let email: string = "a.b@c.com";
			// userDao.emailExists = jest.fn(email =>  Promise.resolve(true));
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(true);
			expect(await userUtil.lEmailExists(email)).toEqual(true);
			done();
		})
	});
	describe('entity existence', () => {
		it('existing entity', async done => {
			let id: string = "existing_user_id";
			// @ts-ignore
			userDao.idExists.mockResolvedValue(true);
			expect(await userUtil.lEntityExists(id)).toEqual(true);
			expect(userDao.idExists).toHaveBeenCalled();
			expect(userDao.idExists).toHaveBeenCalledWith(id);
			done();
		});
		it('no existing entity', async done => {
			let id: string = "non_existing_user_id";
			// @ts-ignore
			userDao.idExists.mockResolvedValue(false);
			expect(await userUtil.lEntityExists(id)).toEqual(false);
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
			let missingAttributes = userUtil.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("");
			done();
		});
		it('the email is missing', async done => {
			let body: any = {
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userUtil.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("email");
			done();
		});
		it('the first name is missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userUtil.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("firstName");
			done();
		});
		it('the last name is missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				firstName: "John",
				password: "ThoughToFigureOut"
			}
			let missingAttributes = userUtil.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("lastName");
			done();
		});
		it('the password is missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
			}
			let missingAttributes = userUtil.lHasRequiredCreateAttributes(body);
			expect(missingAttributes).toEqual("password");
			done();
		});
		it('the first name and the password are missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				lastName: "White",
			}
			let missingAttributes = userUtil.lHasRequiredCreateAttributes(body);
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
			let errorMessage = userUtil.lHasOnlyRequiredCreateAttributes(body)
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
			let errorMessage = userUtil.lHasOnlyRequiredCreateAttributes(body)
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
				role: USER_ROLE.USER,
				rating: 1567,
				state: USER_STATE.ACTIVE
			}
			let invalidPatchAttributes = userUtil.lHasValidPatchAttributes(body)
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
				role: USER_ROLE.USER,
				rating: 1567,
				state: USER_STATE.ACTIVE
			}
			let invalidPatchAttributes = userUtil.lHasValidPatchAttributes(body)
			expect(invalidPatchAttributes).toEqual("id");
			done();
		});
	});
	describe('only valid patch attributes', () => {
		it('all valid patchable attributes present', async done => {
			let body: IUserPatch = {
				email:"a.b@c.com",
				firstName: "Paul",
				lastName: "White",
				password: "ThoughToFigureOut",
				role: USER_ROLE.USER,
				rating: 1567,
				state: USER_STATE.ACTIVE
			}
			let invalidPatchAttributes = userUtil.lHasOnlyValidPatchAttributes(body)
			expect(invalidPatchAttributes).toEqual("");
			done();
		});
		it('an invalid patchable attributes present', async done => {
			let body: any = {
				email:"a.b@c.com",
				emaill:"a.b@c.com",
				firstName: "Paul",
				lastName: "White",
				password: "ThoughToFigureOut",
				role: USER_ROLE.USER,
				rating: 1567,
				state: USER_STATE.ACTIVE
			}
			let invalidPatchAttributes = userUtil.lHasOnlyValidPatchAttributes(body)
			expect(invalidPatchAttributes).toEqual("emaill");
			done();
		});
	});
	describe('Validate that the email is unique', () => {
		it('unique email', async done => {
			let email: string = "unique.email@gmail.com";
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(Promise.resolve(false));
			expect(await userUtil.lEmailExists(email)).toEqual(false);
			expect(userDao.emailExists).toHaveBeenCalled();
			expect(userDao.emailExists).toHaveBeenCalledWith(email);
			done();
		});
		it('existing email', async done => {
			let email: string = "unique.email@rocketmail.com";
			// @ts-ignore
			userDao.emailExists.mockResolvedValue(Promise.resolve(true));
			expect(await userUtil.lEmailExists(email)).toEqual(true);
			expect(userDao.emailExists).toHaveBeenCalled();
			expect(userDao.emailExists).toHaveBeenCalledWith(email);
			done();
		});
	});
	describe('Validate that role is valid', () => {
		it('valid roles', async done => {
			expect(userUtil.lRoleIsValid("system_admin")).toEqual(true);
			expect(userUtil.lRoleIsValid("tournament_director")).toEqual(true);
			expect(userUtil.lRoleIsValid("user")).toEqual(true);
			done();
		});
		it('invalid roles', async done => {
			expect(userUtil.lRoleIsValid("system admin")).toEqual(false);
			expect(userUtil.lRoleIsValid("tournament director")).toEqual(false);
			expect(userUtil.lRoleIsValid("users")).toEqual(false);
			done();
		})
	});
	describe('Validate that rating is valid', () => {
		it('valid rating', async done => {
			expect (utils.isStringNumeric("1300")).toEqual(true);
			done();
		});
		it('invalid ratings', async done => {
			expect(userUtil.lRatingIsValid("400")).toEqual("User rating, 400, is less than minimum, 500");
			expect(userUtil.lRatingIsValid("3100")).toEqual("User rating, 3100, is greater than maximum, 3000");
			done();
		});
	});
	describe('Validate that rating state is valid', () => {
		it('valid rating state', async done => {
			expect (userUtil.lRatingStateIsValid(USER_RATING_STATE.PROVISIONAL)).toEqual(true);
			expect (userUtil.lRatingStateIsValid(USER_RATING_STATE.EFFECTIVE)).toEqual(true);
			done();
		});
		it('invalid rating state', async done => {
			expect (userUtil.lRatingStateIsValid("PROVISIONALl")).toEqual(false);
			expect (userUtil.lRatingStateIsValid("EFFFECTIVE")).toEqual(false);
			done();
		});
	});
	describe('Validate that state is valid', () => {
		it('valid rating state', async done => {
			expect (userUtil.lStateIsValid(USER_STATE.ACTIVE)).toEqual(true);
			expect (userUtil.lStateIsValid(USER_STATE.INACTIVE)).toEqual(true);
			done();
		});
		it('invalid rating state', async done => {
			expect (userUtil.lStateIsValid("ACTIVEe")).toEqual(false);
			expect (userUtil.lStateIsValid("EFFFECTIVEe")).toEqual(false);
			done();
		});
	})
});

