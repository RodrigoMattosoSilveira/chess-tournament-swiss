import app from './../../index';
import {server} from '../../index';
import {UserDto} from "./user.model";
let supertest = require("supertest");

describe('User Entity', () => {
	let request: any;
	beforeEach(() => {
		request = supertest(app);
	});
	it('should return a successful response for GET /user', done => {
		request.get('/user')
			.expect(200, done);
	});
	it('GET /user', function(done) {
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
	it('POST /user', function(done) {
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
						console.log(response.body);
						expect(response.body.firstName).toEqual(user.firstName)
						expect(response.body.lastName).toEqual(user.lastName)
						expect(response.body.permissionLevel).toEqual(user.permissionLevel)
						expect(response.body.email).toEqual(user.email)
						expect(response.body.rating).toEqual(user.rating)
						expect(response.body.password).not.toEqual(user.password)
						done();
					})
					.catch((err: any) => done(err))
				done();
			})
			.catch((err: any) => done(err))
	});
	
	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	afterAll(async (done) => {
		await server.close() // CLOSE THE SERVER CONNECTION
		await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // PLUS THE HACK PROVIDED BY @yss14
		done()
	})
});
