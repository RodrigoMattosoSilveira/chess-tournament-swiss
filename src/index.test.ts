import express from "express";
import http from "http";
const request = require('supertest');
import {IConfig} from "./config/config.interface";
let config: IConfig = require('./config/config.dev.json');

import {AMongoDb, MongoAtlas, MongoInMemory} from "./server/mongodb";
import {launchServers} from "./server/swiss-pairing";
import {ISwissPairingServers} from "./server/swiss-pairings-interface";

describe('Swiss Pairing Index Test', () => {
	let response: any;
	let mongodb: AMongoDb;
	let swissPairingServers: ISwissPairingServers;
	let app: express.Application;

	beforeAll(async (done) => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		swissPairingServers = launchServers(mongodb);
		app = swissPairingServers.applicationServer;
		done();
	})

	it('should return a successful response for GET /hello', async done => {
		response = await request(app)
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
		response = await request(app)
			.get('/quit')
			.expect(200);
		console.log("\nindex/response :" + JSON.stringify(response) + '\n');
		expect(response.text).toEqual('Express Server terminated!');
		done()
	})
});

