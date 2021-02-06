import {UserDto} from "./user.model";
import {USER_STATE, user_states} from "../../contants/contants";
import app from './../../index';
import {server} from '../../index';
const request = require('supertest');


describe('User Entity', () => {
	let resource = '/user';
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
	test('POST /user', async done =>  {
		let entityDto: UserDto = {
			id: "somecrazynumber",
			email: "Paul.Roberts@yahoo.com",
			password: "$dfg&*mns12PP",
			firstName: "Paul",
			lastName: "Roberts",
			permissionLevel: 0,
			rating: 1234
		}
		
		// POST the UserDto
		await request(app)
			.post(resource)
			.send(entityDto)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201)
			.then((response: any) => {
				// console.log('User Entity/POST /tournament: ' + response.body.id);
				entityDto.id = response.body.id;
				expect(response.body.id).toBeTruthy()
			})
			.catch((err: any) => done(err));
		
		// GET the UserDto
		await request(app)
			.get(resource + '/' + entityDto.id)
			.set('Accept', 'application/json')
			.expect(200)
			.then((response: any) => {
				// console.log(response);
				// console.log(response.body);
				expect(response.body.firstName).toEqual(entityDto.firstName);
				expect(response.body.lastName).toEqual(entityDto.lastName);
				expect(response.body.permissionLevel).toEqual(entityDto.permissionLevel);
				expect(response.body.email).toEqual(entityDto.email);
				expect(response.body.rating).toEqual(entityDto.rating);
				expect(response.body.password).not.toEqual(entityDto.password);
				expect(response.body.state).toEqual(USER_STATE.ACTIVE);
			})
			.catch((err: any) => done(err))
		done();
	});
	//
	// describe('PATCH /user:id', () => {
	// 	let response: any;
	// 	let firstName = "firstName";
	// 	let lastName = "lastName";
	// 	let emailDifferentiator = "a";
	// 	let testEmail: string = "";
	// 	let user: UserDto = {
	// 		id: "somecrazynumber",
	// 		email: "Paul.Roberts@yahoo.com",
	// 		password: "$dfg&*mns12PP",
	// 		firstName: "Paul",
	// 		lastName: "Roberts",
	// 		permissionLevel: 0,
	// 		rating: 1234
	// 	}
	// 	let testingUser: UserDto;
	// 	beforeAll(async() => {
	// 		emailDifferentiator += "a";
	// 		testEmail = firstName + '.' + lastName + "." + emailDifferentiator + "@yahoo.com"
	// 		user.email = testEmail;
	// 		await postUser(request, user)
	// 			.then((response: any) => {
	// 				expect(201);
	// 				testingUser = <UserDto>response.body;
	// 			})
	// 			.catch((err: any) => (err))
	// 	});
	// 	test.only('patches all valid attributes', async() => {
	// 		let userPatch: UserDto = {
	// 			id: testingUser.id,
	// 			email: "Frank.Franklin@gmail.com",
	// 			password: "$dfg&*mns12PP",
	// 			firstName: "Frank",
	// 			lastName: "Franklin",
	// 			permissionLevel: 5,
	// 			rating: 2222,
	// 			state: "inactive"
	// 		}
	// 		await patchUser(request, userPatch)
	// 			.then((response: any) => {
	// 				expect(200);
	// 				expect(response.body.email).toEqual(userPatch.email);
	// 				expect(response.body.firstName).toEqual(userPatch.firstName);
	// 				expect(response.body.lastName).toEqual(userPatch.lastName);
	// 				expect(response.body.permissionLevel).toEqual(userPatch.permissionLevel);
	// 				expect(response.body.rating).toEqual(userPatch.rating);
	// 				expect(response.body.state).toEqual(userPatch.state);
	// 			})
	// 			.catch((err: any) => (err))
	// 	});
	// 	test('PATCH /user:id email', (done) => {
	// 		expect(false).toEqual(true);
	// 	});
	// 	test('PATCH /user:id password', (done) => {
	// 		expect(false).toEqual(true);
	// 	});
	// 	test('PATCH /user:id firstName', (done) => {
	// 		expect(false).toEqual(true);
	// 	});
	// 	test('PATCH /user:id lastName', (done) => {
	// 		expect(false).toEqual(true);
	// 	});
	// 	test('PATCH /user:id state', (done) => {
	// 		expect(false).toEqual(true);
	// 	});
	// })
	
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
