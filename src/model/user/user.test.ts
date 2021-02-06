import {UserDto} from "./user.model";
import {USER_STATE} from "../../contants/contants";
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

	describe('PATCH /user:id', () => {
		let firstName = "firstName";
		let lastName = "lastName";
		let emailDifferentiator = "a";
		let testEmail: string = "";
		
		// Create this user and validate PATCH against it
		let entityDto: any = {
			email: "Paul.Roberts@yahoo.com",
			password: "$dfg&*mns12PP",
			firstName: "Paul",
			lastName: "Roberts",
			permissionLevel: 0,
			rating: 1234
		}
		
		// Use it to p
		let entityPatch: UserDto = {
			id: entityDto.id,
			email: "Frank.Franklin@gmail.com",
			password: "$dfg&*mns13TT",
			firstName: "Frank",
			lastName: "Franklin",
			permissionLevel: 5,
			rating: 2222,
			state: "inactive"
		}
		
		beforeAll(async done => {
			emailDifferentiator += "a";
			testEmail = firstName + '.' + lastName + "." + emailDifferentiator + "@yahoo.com"
			entityDto.email = testEmail;
			
			// POST the USER, will validate PATCH against it
			await request(app)
				.post(resource)
				.send(entityDto)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response: any) => {
					// console.log('User Entity/POST /user: ' + response.body.id);
					entityDto.id = response.body.id;
					expect(response.body.id).toBeTruthy()
				})
				.catch((err: any) => done(err));
			done();
		});
		it('patches all patchable attributes', async done => {
			let response = await patchEntity(request(app), resource + '/' + entityDto.id, entityPatch);
			expect(response.body.firstName).toEqual(entityPatch.firstName);
			expect(response.body.lastName).toEqual(entityPatch.lastName);
			expect(response.body.permissionLevel).toEqual(entityPatch.permissionLevel);
			expect(response.body.email).toEqual(entityPatch.email);
			expect(response.body.rating).toEqual(entityPatch.rating);
			expect(response.body.password).not.toEqual(entityPatch.password);
			expect(response.body.state).toEqual(USER_STATE.INACTIVE);
			done();
		});
		it('PATCH /user:id email', async done => {
			const patchMe = {"email": "crazy.horse@someserver.com"};
			let response = await patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.email).toEqual(patchMe.email);
			done();
		});
		it('PATCH /user:id password', async done => {
			const patchMe = {"password": "$dfg&*mns14zz"};
			let response = await patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.password).not.toEqual(patchMe.password);
			done();
		});
		it('PATCH /user:id firstName', async done => {
			const patchMe = {"firstName": "Jonas"};
			let response = await patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.firstName).toEqual(patchMe.firstName);
			done();
		});
		it('PATCH /user:id lastName', async done => {
			const patchMe = {"lastName": "Andreozzi"};
			let response = await patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.lastName).toEqual(patchMe.lastName);
			done();
		});
		it('PATCH /user:id state', async done => {
			const patchMe = {"state": USER_STATE.ACTIVE};
			let response = await patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
			expect(response.body.state).toEqual(patchMe.state);
			done();
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
 * Helper function to patch a USER and return the response object
 * @param agent
 * @param url
 * @param patch
 * @return response
 */
const  patchEntity = async (agent: any, url: string, patch: any): Promise<any> => {
	return await agent
		.patch(url)
		.send(patch)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200);
}
