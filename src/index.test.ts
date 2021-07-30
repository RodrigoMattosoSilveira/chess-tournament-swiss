import express from "express";
const request = require('supertest');
var mongoose = require('mongoose');

import {IConfig} from "./config/config.interface";
let config: IConfig = require('./config/config.dev.json');

import {AMongoDb, MongoAtlas, MongoInMemory} from "./server/mongodb";
import {ISwissPairingServers} from "./server/swiss-pairings-interface";
import app from "./server/app";

describe('Swiss Pairing Index Test', () => {
	let response: any;
	let mongodb: AMongoDb;

	beforeAll(async (done) => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions);
		mongodb.connect()
			.then(() => {
				console.log(`MongoDB Server running`);
				done();
			})
			.catch((err: any) => {
				done (err);
			})
		done();
	})

	it('App is connected', async done => {
		response = await request(app)
			.get('/hello')
			.expect(200)
			.then((response: any) => {
				expect(response.text).toEqual('Swiss Pairing up and running!');
				done();
			})
			.catch((err: any) => {
				done(err);
			})
		done();
		
	});

	// Used https://github.com/visionmedia/supertest/issues/520
	// https://github.com/visionmedia/supertest/issues/520
	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
	afterAll(async (done) => {
		await mongodb.close();
		done();
	})
});

