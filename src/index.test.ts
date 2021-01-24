import app from './index';
// import * as supertest from 'supertest';
let supertest = require("supertest");

describe('app', () => {
	let request: any;
	beforeEach(() => {
		request = supertest(app);
	});
	it('should return a successful response for GET /', done => {
		request.get('/')
			.expect(200, done);
	});
});

