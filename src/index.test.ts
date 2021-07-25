import express from "express";
import http from "http";
const request = require('supertest');

import {createExpressApp, createHttpServer} from "./server/server";

describe('Express Application', () => {
	let response: any;
	let expressApplication: express.Application;
	let httpServer: http.Server;
	beforeAll(async (done) => {
		expressApplication = createExpressApp();
		httpServer = createHttpServer(expressApplication);
		done()
	})

	it('should return a successful response for GET /hello', async done => {
		response = await request(expressApplication)
			.get('/hello')
			.expect(200);
		console.log("\nindex/response :" + JSON.stringify(response) + '\n');
		expect(response.text).toEqual('Express Server up and running!');
		done();
		
	});
	
	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	afterAll(async (done) => {
		response = await request(expressApplication)
			.get('/quit')
			.expect(200);
		console.log("\nindex/response :" + JSON.stringify(response) + '\n');
		expect(response.text).toEqual('Express Server terminated!');
		done()
	})
});

