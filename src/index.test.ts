import app from './index';
import {server} from "./index";
const request = require('supertest');

describe('app', () => {
	let response: any;
	it('should return a successful response for GET /', async done => {
		response = await request(app)
			.get('/')
			.expect(200);
		console.log("\nindex/response :" + JSON.stringify(response) + '\n');
		expect(response.text).toEqual('Server up and running!');
		done();
		
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

