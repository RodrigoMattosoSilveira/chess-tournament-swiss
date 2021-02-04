import express from 'express';
import app from './../../index';
import {server} from '../../index';
import {UserDto} from "./user.model";
import {USER_STATE, user_states} from "../../contants/contants";
let supertest = require("supertest");

describe('User Entity', () => {
	let request: any;
	beforeAll(() => {
		request = supertest(app);
	});
	test('should return a successful response for GET /user', done => {
		request.get('/user')
			.expect(200, done);
	});
	test('GET /user', function(done) {
		return request
			.get('/user')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((response: any) => {
				// console.log(response);
				expect(response.body).toEqual([])
				done();
			})
			.catch((err: any) => done(err))
	});
	test('POST /user', function(done) {
		let user: UserDto = {
			id: "somecrazynumber",
			email: "Paul.Roberts@yahoo.com",
			password: "$dfg&*mns12PP",
			firstName: "Paul",
			lastName: "Roberts",
			permissionLevel: 0,
			rating: 1234
		}
		return request
			.post('/user')
			.send(user)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201)
			.then((response: any) => {
				// console.log(response);
				expect(response.body.id).toBeTruthy()
				return request
					.get('/user/' + response.body.id)
					.set('Accept', 'application/json')
					.expect(200)
					.then((response: any) => {
						// console.log(response);
						// console.log(response.body);
						expect(response.body.firstName).toEqual(user.firstName);
						expect(response.body.lastName).toEqual(user.lastName);
						expect(response.body.permissionLevel).toEqual(user.permissionLevel);
						expect(response.body.email).toEqual(user.email);
						expect(response.body.rating).toEqual(user.rating);
						expect(response.body.password).not.toEqual(user.password);
						expect(response.body.state).toEqual(USER_STATE.ACTIVE);
						done();
					})
					.catch((err: any) => done(err))
				done();
			})
			.catch((err: any) => done(err))
	});
	
	describe('PATCH /user:id', () => {
		let response: any;
		let firstName = "firstName";
		let lastName = "lastName";
		let emailDifferentiator = "a";
		let testEmail: string = "";
		let user: UserDto = {
			id: "somecrazynumber",
			email: "Paul.Roberts@yahoo.com",
			password: "$dfg&*mns12PP",
			firstName: "Paul",
			lastName: "Roberts",
			permissionLevel: 0,
			rating: 1234
		}
		let testingUser: UserDto;
		beforeAll(async() => {
			emailDifferentiator += "a";
			testEmail = firstName + '.' + lastName + "." + emailDifferentiator + "@yahoo.com"
			user.email = testEmail;
			await postUser(request, user)
				.then((response: any) => {
					expect(201);
					testingUser = <UserDto>response.body;
				})
				.catch((err: any) => (err))
		});
		test.only('patches all valid attributes', async() => {
			let userPatch: UserDto = {
				id: testingUser.id,
				email: "Frank.Franklin@gmail.com",
				password: "$dfg&*mns12PP",
				firstName: "Frank",
				lastName: "Franklin",
				permissionLevel: 5,
				rating: 2222,
				state: "inactive"
			}
			await patchUser(request, userPatch)
				.then((response: any) => {
					expect(200);
					expect(response.body.email).toEqual(userPatch.email);
					expect(response.body.firstName).toEqual(userPatch.firstName);
					expect(response.body.lastName).toEqual(userPatch.lastName);
					expect(response.body.permissionLevel).toEqual(userPatch.permissionLevel);
					expect(response.body.rating).toEqual(userPatch.rating);
					expect(response.body.state).toEqual(userPatch.state);
				})
				.catch((err: any) => (err))
		});
		test('PATCH /user:id email', (done) => {
			expect(false).toEqual(true);
		});
		test('PATCH /user:id password', (done) => {
			expect(false).toEqual(true);
		});
		test('PATCH /user:id firstName', (done) => {
			expect(false).toEqual(true);
		});
		test('PATCH /user:id lastName', (done) => {
			expect(false).toEqual(true);
		});
		test('PATCH /user:id state', (done) => {
			expect(false).toEqual(true);
		});
	})
	
	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	afterAll(async (done) => {
		await server.close() // CLOSE THE SERVER CONNECTION
		await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // PLUS THE HACK PROVIDED BY @yss14
		done()
	})
});

/**
 * Helper unction to post a USER and return the new user's id
 * @param request
 * @param user
 * @return newly created user id
 */
const  postUser = async (request: any, user: UserDto) => {
	let userId: string = "";
	await request
		.post('/user')
		.send(user)
		.set('Accept', 'application/json')
		.then((response: any) => {
			// console.log('\n user.test/postUser/response' + response + '\n');
			return response;
		})
}

/**
 * Helper unction to post a USER and return the new user's id
 * @param request
 * @param id
 * @return newly created user id
 */
const  getUser = async (request: any, id: string) => {
	await request
		.get('/user/' + id)
		.set('Accept', 'application/json')
		.then((response: any) => {
			// console.log('\n user.test/getUser/response' + response + '\n');
			return response;
		})
}

/**
 * Helper unction to post a USER and return the new user's id
 * @param request
 * @param userPath: UserDto
 * @return newly created user id
 */
const  patchUser = async (request: any, userPath: UserDto) => {
	let id = userPath.id;
	let patch: any = {}
	Object.keys(userPath).forEach(key => {// @ts-ignore
		if (key !== "id") {
			// @ts-ignore
			patch[key] = userPath[key]
		}
	})
	await request
		.patch('/user/' + id)
		. send(patch)
		.set('Accept', 'application/json')
		.then((response: any) => {
			// console.log('\n user.test/getUser/response' + response + '\n');
			return response;
		})
}