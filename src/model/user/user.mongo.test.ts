// Transform these into

import express from "express";
import {UserDto} from "./user.interfaces";
import {UserMongo, IUserMongo, IUserMongoDoc} from "./user-mongo";
import {USER_DEFAULT_CONSTANTS} from "./user.constants";
import {AMongoDb, MongoAtlas, MongoInMemory} from "../../server/mongodb";
import {ISwissPairingServers} from "../../server/swiss-pairings-interface";
import {launchServers} from "../../server/swiss-pairing";

import {IConfig} from "../../config/config.interface";
let config: IConfig = require('../../config/config.dev.json');

describe('User MongoDB Unit Tests', () => {
	/**
	 * Note:
	 * - these tests validate the MONGO/MONGOOSE setup, completely bypassing the
	 *   middleware;
	 * - use the in memory database
	 *
	 * See Typescript With MongoDB and Node/Express,
	 * https://medium.com/swlh/typescript-with-mongoose-and-node-express-24073d51d2ee
	 *
	 */

		//	Use the in memory database to validate
	let entityDto: UserDto = {
		email: "Paul.Roberts@yahoo.com",
		firstName: "Paul",
		id: "somecrazynumber_1",
		lastName: "Roberts",
		password: "$dfg&*mns12PP",
		rating: 1234,
		ratingState: USER_DEFAULT_CONSTANTS.RATING_STATE,
		state: USER_DEFAULT_CONSTANTS.STATE
	};
	let entityDto_1: UserDto = {
		email: "Joan.Jones@yahoo.com",
		firstName: "Joan",
		id: "somecrazynumber_2",
		lastName: "Jones",
		password: "$dfg&*mns12QQ"
	};
	let entityDto_2: UserDto = {
		email: "Francis.Franco@yahoo.com",
		firstName: "Francis",
		id: "somecrazynumber_3",
		lastName: "Franco",
		password: "$dfg&*mns12PP"
	};
	let savedEntity: IUserMongo;
	let savedEntityError: any;
	let readEntity: UserMongoReadEntity;
	let readEntities: IUserMongoDoc[];
	let updatedEntity: UserMongoReadEntity;
	let mongodb: AMongoDb;
	let swissPairingServers: ISwissPairingServers;
	let app: express.Application;

	beforeAll(async () => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		swissPairingServers = launchServers(mongodb);
		app = swissPairingServers.applicationServer;
	});

	afterEach(async () => {
		await mongodb.clear();
		// @ts-ignore
		savedEntity = null;
		savedEntityError = null;
		readEntity = null;
		// @ts-ignore
		readEntities = null;
		updatedEntity = null;
	});

	afterAll(async () => {
		await mongodb.close();
	});

	// Type experiment
	type UserMongoReadEntity = IUserMongoDoc | null;
	it('User MongoDB Operations canonical unit test', async done => {
		expect(1 + 1).toEqual(2);
		done();
	});
	it('User Mongo save unit test', async () => {
		expect.assertions(4)
		// create new post model instance
		const userMongo = UserMongo.build({...entityDto})
		// set some test properties
		// savedEntity = await userMongo.save();
		await userMongo.save()
			.then((doc: IUserMongo) => {
				savedEntity = doc;
			})
			.catch((error: any) => {
				savedEntityError = error;
			})
		// find inserted post by title
		expect(savedEntity).toBeTruthy();
		expect(savedEntityError).toBeFalsy()
		//@ts-ignore
		expect(savedEntity.email).toEqual(entityDto.email);
		// check that content is expected
		//@ts-ignore
		expect(savedEntity.firstName).toEqual(entityDto.firstName);
	});
	it('User Mongo save unit test error', async () => {
		expect.assertions(2)
		// create a user document
		const userMongo = UserMongo.build({...entityDto});
		userMongo.rating = "abcd"; // force an error
		// savedEntity = await userMongo.save(); // this fails
		await userMongo.save()
			.then((doc: IUserMongo) => {
				savedEntity = doc;
			})
			.catch((error: any) => {
				savedEntityError = error;
				console.log("User save error: " + JSON.stringify(savedEntityError));
			})
		expect(savedEntity).toBeFalsy();
		expect(savedEntityError).toBeTruthy();
	});
	it('User Mongo fineOne unit test', async () => {
		// create user than read it
		const userMongo = UserMongo.build({...entityDto})
		savedEntity = await userMongo.save()
		expect(savedEntity).toBeTruthy();
		readEntity = await UserMongo.findOne({id: entityDto.id}).exec();
		// console.log('Post document from memory-db', postInDb)
		// check that title is expected
		expect(readEntity).toBeTruthy();
		//@ts-ignore
		expect(readEntity.email).toEqual(entityDto.email)
		// check that content is expected
		//@ts-ignore
		expect(readEntity.firstName).toEqual(entityDto.firstName)
	});
	it('User Mongo findAll unit test', async () => {
		// create 3 users than read them
		let userMongo = UserMongo.build({...entityDto});
		savedEntity = await userMongo.save();
		expect(savedEntity).toBeTruthy();
		userMongo = UserMongo.build({...entityDto_1});
		savedEntity = await userMongo.save();
		expect(savedEntity).toBeTruthy();
		userMongo = UserMongo.build({...entityDto_2});
		savedEntity = await userMongo.save();
		expect(savedEntity).toBeTruthy();
		// @ts-ignore
		readEntities = await UserMongo.find();
		expect(readEntities).toBeTruthy();
		let names = readEntities.map((doc: IUserMongoDoc) => doc.lastName).sort();
		expect(names.length).toBe(3);
		expect(names).toEqual(["Franco", "Jones", "Roberts", ]);
	});
	it('User Mongo findOneAndUpdate unit test', async () => {
		// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
		const userMongo = UserMongo.build({...entityDto})
		savedEntity = await userMongo.save();
		expect(savedEntity).toBeTruthy();
		//@ts-ignore
		expect(savedEntity.lastName).toEqual(entityDto.lastName);
		let conditions = {id: entityDto.id};
		let update = {lastName: "NewLastName"};
		let options = {new: true, lean: true};
		updatedEntity = await UserMongo.findOneAndUpdate(conditions, update, options, (error, doc) => {
			console.log("Error handling findOneAndUpdate: " + error);
		}).exec();
		expect(updatedEntity).toBeTruthy();
		//@ts-ignore
		expect(updatedEntity.lastName).toEqual( "NewLastName")
	});

});
