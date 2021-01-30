import app from './index';
import {server} from "./index";
const axios = require('axios');
let supertest = require("supertest");

describe('app', () => {
	let request: any;
	beforeEach(() => {
		request = supertest(app);
	});
	// it('should return a successful response for GET /', done => {
	// 	request.get('/')
	// 		.expect(200, done);
	// });
	it('should return a successful response for GET /', async() => {
		try {
			const response = await axios.get('http://localhost:3000/');
			// console.log(response);
			expect(response.status).toEqual(200);
			expect(response.data).toEqual('Server up and running!');
		} catch (error) {
			console.error(error);
		}
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

