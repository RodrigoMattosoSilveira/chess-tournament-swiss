import {UserDto} from "./user.interfaces";
import {USER_STATE} from "../../contants/contants";
import app from './../../index';
import {server} from '../../index';
const request = require('supertest');
import { Utils } from "../../utils/utils";
import {UserMongo, IUserMongo, IUserMongoDoc} from "./user-mongo";
import * as testDb from '../../utils/test-db';
import {USER_DEFAULT_CONSTANTS} from "./user.constants";

// describe('User Entity', () => {
// 	const utils = new Utils();
// 	let resource = '/user';
// 	let response: any;
// 	it('GET /user', async done => {
// 		response = await request(app)
// 			.get(resource)
// 			.set('Accept', 'application/json')
// 			.expect('Content-Type', /json/)
// 			.expect(200);
// 		expect(response.body).toEqual([]);
// 		done();
// 	});
// 	it('POST /user', async done =>  {
// 		let entityDto: UserDto = {
// 			id: "somecrazynumber",
// 			email: "Paul.Roberts@yahoo.com",
// 			password: "$dfg&*mns12PP",
// 			firstName: "Paul",
// 			lastName: "Roberts",
// 			permissionLevel: 0,
// 			rating: 1234
// 		}
//
// 		// POST the UserDto
// 		await request(app)
// 			.post(resource)
// 			.send(entityDto)
// 			.set('Accept', 'application/json')
// 			.expect('Content-Type', /json/)
// 			.expect(201)
// 			.then((response: any) => {
// 				// console.log('User Entity/POST /user: ' + response.body.id);
// 				entityDto.id = response.body.id;
// 				expect(response.body.id).toBeTruthy()
// 			})
// 			.catch((err: any) => done(err));
//
// 		// GET the UserDto
// 		await request(app)
// 			.get(resource + '/' + entityDto.id)
// 			.set('Accept', 'application/json')
// 			.expect(200)
// 			.then((response: any) => {
// 				// console.log(response);
// 				// console.log(response.body);
// 				expect(response.body.firstName).toEqual(entityDto.firstName);
// 				expect(response.body.lastName).toEqual(entityDto.lastName);
// 				expect(response.body.permissionLevel).toEqual(entityDto.permissionLevel);
// 				expect(response.body.email).toEqual(entityDto.email);
// 				expect(response.body.rating).toEqual(entityDto.rating);
// 				expect(response.body.password).not.toEqual(entityDto.password);
// 				expect(response.body.state).toEqual(USER_STATE.ACTIVE);
// 			})
// 			.catch((err: any) => done(err))
// 		done();
// 	});
//
// 	describe('PATCH /user:id', () => {
// 		// Create this entity and validate PATCH against it
// 		let entityDto: any = {
// 			email: "Paul.Roberts@yahoo.com",
// 			password: "$dfg&*mns12PP",
// 			firstName: "Paul",
// 			lastName: "Roberts",
// 			permissionLevel: 0,
// 			rating: 1234
// 		}
//
// 		// Use it to patch all patchable attributes at once
// 		let entityPatch: UserDto = {
// 			id: entityDto.id,
// 			email: "Frank.Franklin@gmail.com",
// 			password: "$dfg&*mns13TT",
// 			firstName: "Frank",
// 			lastName: "Franklin",
// 			permissionLevel: 5,
// 			rating: 2222,
// 			state: "inactive"
// 		}
//
// 		beforeAll(async done => {
// 			entityDto.email = "Paul.Robertssssss@yahoo.com";
//
// 			// POST the USER, will validate PATCH against it
// 			await request(app)
// 				.post(resource)
// 				.send(entityDto)
// 				.set('Accept', 'application/json')
// 				.expect('Content-Type', /json/)
// 				.expect(201)
// 				.then((response: any) => {
// 					// console.log('User Entity/POST /user: ' + response.body.id);
// 					entityDto.id = response.body.id;
// 					expect(response.body.id).toBeTruthy()
// 				})
// 				.catch((err: any) => done(err));
// 			done();
// 		});
// 		it('patches all patchable attributes', async done => {
// 			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, entityPatch);
// 			expect(response.body.firstName).toEqual(entityPatch.firstName);
// 			expect(response.body.lastName).toEqual(entityPatch.lastName);
// 			expect(response.body.permissionLevel).toEqual(entityPatch.permissionLevel);
// 			expect(response.body.email).toEqual(entityPatch.email);
// 			expect(response.body.rating).toEqual(entityPatch.rating);
// 			expect(response.body.password).not.toEqual(entityPatch.password);
// 			expect(response.body.state).toEqual(USER_STATE.INACTIVE);
// 			done();
// 		});
// 		it('PATCH /user:id email', async done => {
// 			const patchMe = {"email": "crazy.horse@someserver.com"};
// 			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
// 			expect(response.body.email).toEqual(patchMe.email);
// 			done();
// 		});
// 		it('PATCH /user:id password', async done => {
// 			const patchMe = {"password": "$dfg&*mns14zz"};
// 			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
// 			expect(response.body.password).not.toEqual(patchMe.password);
// 			done();
// 		});
// 		it('PATCH /user:id firstName', async done => {
// 			const patchMe = {"firstName": "Jonas"};
// 			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
// 			expect(response.body.firstName).toEqual(patchMe.firstName);
// 			done();
// 		});
// 		it('PATCH /user:id lastName', async done => {
// 			const patchMe = {"lastName": "Andreozzi"};
// 			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
// 			expect(response.body.lastName).toEqual(patchMe.lastName);
// 			done();
// 		});
// 		it('PATCH /user:id state', async done => {
// 			const patchMe = {"state": USER_STATE.ACTIVE};
// 			let response = await utils.patchEntity(request(app), resource + '/' + entityDto.id, patchMe);
// 			expect(response.body.state).toEqual(patchMe.state);
// 			done();
// 		});
// 	})
//
// 	// Used https://github.com/visionmedia/supertest/issues/520
// 	// https://github.com/visionmedia/supertest/issues/520
// 	// to handle a combination of TCPSERVERWRAP and  EADDRINUSE: address already in use errors
// 	afterAll(async (done) => {
// 		await server.close() // CLOSE THE SERVER CONNECTION
// 		await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // PLUS THE HACK PROVIDED BY @yss14
// 		done()
// 	})
// });
describe('User Entity unit tests', () => {
	describe('User MongoDB Operations unit tests', () => {
		/**
		 * See How to setup Jest for Node.js + Mongoose + TypeScript projects,
		 * https://kimlehtinen.com/how-to-setup-jest-for-node-js-mongoose-typescript-projects/
		 *
		 * Its prescription for setting up th MongoDB model are faulty. I relied on
		 * Typescript With MongoDB and Node/Express,
		 * https://medium.com/swlh/typescript-with-mongoose-and-node-express-24073d51d2ee
		 *
		 */
			
			//	Use the in memory database to validate
		let entityDto: UserDto = {
			email: "Paul.Roberts@yahoo.com",
			firstName: "Paul",
			id: "somecrazynumber",
			lastName: "Roberts",
			password: "$dfg&*mns12PP",
			rating: 1234,
			ratingState: USER_DEFAULT_CONSTANTS.RATING_STATE,
			state: USER_DEFAULT_CONSTANTS.STATE
		};
		let entityDto_1: UserDto = {
			email: "Joan.Jones@yahoo.com",
			firstName: "Joan",
			id: "anothercrazynumber",
			lastName: "Jones",
			password: "$dfg&*mns12QQ",
			rating: 1243,
			ratingState: USER_DEFAULT_CONSTANTS.RATING_STATE,
			state: USER_DEFAULT_CONSTANTS.STATE
		};
		let entityDto_2: UserDto = {
			email: "Francis.Franco@yahoo.com",
			firstName: "Francis",
			id: "yetanothercrazynumber",
			lastName: "Franco",
			password: "$dfg&*mns12PP",
			rating: 1234,
			ratingState: USER_DEFAULT_CONSTANTS.RATING_STATE,
			state: USER_DEFAULT_CONSTANTS.STATE
		};
		let savedEntity: IUserMongo;
		let savedEntityError: any;
		let readEntity: UserMongoReadEntity;
		let readEntities: IUserMongoDoc[];
		let updatedEntity: UserMongoReadEntity;
		
		
		beforeAll(async () => {
			await testDb.connect()
		});
		
		afterEach(async () => {
			await testDb.clearDatabase()
			// @ts-ignore
			savedEntity = null;
			savedEntityError = null;
			readEntity = null;
			// @ts-ignore
			readEntities = null;
			updatedEntity = null;
		});
		
		afterAll(async () => {
			await testDb.closeDatabase()
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
	describe('User DAO Operations unit tests', () => {
	
	});
	describe('User Service Operations', () => {
		it('User Service Operations canonical unit test', async done => {
			expect(1 + 1).toEqual(2);
			done();
		});
	
	});
	describe('User Configuration Operations', () => {
		it('User Configuration Operations canonical unit test', async done => {
			expect(1 + 1).toEqual(2);
			done();
		});
	});
	describe('User Middleware Operations', () => {
		it('User Middleware Operations canonical unit test', async done => {
			expect(1 + 1).toEqual(2);
			done();
		});
	});
});
