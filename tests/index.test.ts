import app from '../src/index';
// import * as supertest from 'supertest';
var supertest = require("supertest");

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

