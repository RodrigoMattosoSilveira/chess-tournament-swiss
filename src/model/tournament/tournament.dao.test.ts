import {ITournamentDto} from "./tournament.interfaces";
import {TournamentMongo, ITournamentMongo, ITournamentMongoDoc} from "./tournament.mongo";
import { TOURNAMENT_DEFAULTS} from "./tournament.constants";
import {AMongoDb, MongoInMemory} from "../../server/mongodb";
import app from "../../server/app";

import {IConfig} from "../../config/config.interface";
let config: IConfig = require('../../config/config.dev.json');

describe('Tournament MongoDB Unit Tests', () => {
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
	let entityDto: ITournamentDto = {
			eid: "somecrazynumber",
			name: "USA OPEN 2020"
		};
	let entityDto_1: ITournamentDto = {
		eid: "somecrazynumber_1",
		name: "USA OPEN 2021"
	};
	let entityDto_2: ITournamentDto = {
		eid: "somecrazynumber_2",
		name: "USA OPEN 2022"
	};
	let savedEntity: ITournamentMongo;
	let savedEntityError: any;
	let readEntity: TournamentMongoReadEntity;
	let readEntities: ITournamentMongoDoc[];
	let updatedEntity: TournamentMongoReadEntity;
	let mongodb: AMongoDb;

	beforeAll(async done => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		mongodb.connect()
			.then(() => {
				console.log(`MongoDB Server running`);
				app.listen(config.expressServerPort, () => {
					console.log(`Express HTTP Server running`);
				});
				done();
			})
			.catch((err: any) => {
				done (err);
			})
		done();
	});

	afterEach(async done => {
		await mongodb.clear();
		// @ts-ignore
		savedEntity = null;
		savedEntityError = null;
		readEntity = null;
		// @ts-ignore
		readEntities = null;
		updatedEntity = null;
		done();
	});

	afterAll(async done => {
		await mongodb.close();
		done();
	});

	// Type experiment
	type TournamentMongoReadEntity = ITournamentMongoDoc | null;
	it('Tournament MongoDB Operations canonical unit test', async done => {
		expect(1 + 1).toEqual(2);
		done();
	});
	it('Tournament Mongo CREATE unit test, success', async done => {
		expect.assertions(4)
		// create new post model instance
		const tournamentMongo = TournamentMongo.build({...entityDto})
		await tournamentMongo.save()
			.then((doc: ITournamentMongo) => {
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
		done();
	});
	it('Tournament Mongo CREATE unit test, fail', async done => {
		expect.assertions(2)
		// create a tournament document
		const tournamentMongo = TournamentMongo.build({...entityDto});
		tournamentMongo.year = "abcd"; // force an error
		// savedEntity = await TournamentMongo.save(); // this fails
		await tournamentMongo.save()
			.then((doc: ITournamentMongo) => {
				savedEntity = doc;
			})
			.catch((error: any) => {
				savedEntityError = error;
				console.log("Tournament save error: " + JSON.stringify(savedEntityError));
			})
		expect(savedEntity).toBeFalsy();
		expect(savedEntityError).toBeTruthy();
		done();
	});
	it('Tournament Mongo READ:eid unit test, success', async done => {
		// create tournament than read it
		const tournamentMongo = TournamentMongo.build({...entityDto});
		savedEntity = await tournamentMongo.save();
		expect(savedEntity).toBeTruthy();
		readEntity = await TournamentMongo.findOne({eid: entityDto.eid}).exec();
		// console.log('Post document from memory-db', postInDb)
		// check that title is expected
		expect(readEntity).toBeTruthy();
		//@ts-ignore
		expect(readEntity.eid).toEqual(entityDto.eid)
		// check that content is expected
		//@ts-ignore
		expect(readEntity.name).toEqual(entityDto.name)
		done();
	});
	it('Tournament Mongo findAll unit test', async done => {
		// create 3 Tournaments than read them
		let tournamentMongo = TournamentMongo.build({...entityDto});
		savedEntity = await tournamentMongo.save();
		expect(savedEntity).toBeTruthy();
		tournamentMongo = TournamentMongo.build({...entityDto_1});
		savedEntity = await tournamentMongo.save();
		expect(savedEntity).toBeTruthy();
		tournamentMongo = TournamentMongo.build({...entityDto_2});
		savedEntity = await tournamentMongo.save();
		expect(savedEntity).toBeTruthy();
		// @ts-ignore
		readEntities = await TournamentMongo.find();
		expect(readEntities).toBeTruthy();
		let names = readEntities.map((doc: ITournamentMongoDoc) => doc.name).sort();
		expect(names.length).toBe(3);
		expect(names).toEqual(["USA OPEN 2020", "USA OPEN 2021", "USA OPEN 2022", ]);
		done();
	});
	it('Tournament Mongo findOneAndUpdate unit test, success', async done => {
		// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
		const tournamentMongo = TournamentMongo.build({...entityDto})
		savedEntity = await tournamentMongo.save();
		expect(savedEntity).toBeTruthy();
		//@ts-ignore
		expect(savedEntity.lastName).toEqual(entityDto.lastName);
		let conditions = {eid: entityDto.eid};
		let update = {name: "New Tournament Name"};
		let options = {new: true, lean: true};
		updatedEntity = await TournamentMongo.findOneAndUpdate(conditions, update, options, (error: any, doc: any) => {
			console.log("Error handling findOneAndUpdate: " + error);
		}).exec();
		expect(updatedEntity).toBeTruthy();
		//@ts-ignore
		expect(updatedEntity.name).toEqual( update.name);
		done();
	});
});
