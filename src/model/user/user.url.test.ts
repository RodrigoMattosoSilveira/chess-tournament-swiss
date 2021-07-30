import {IUserCreate, IUserPatch} from "./user.interfaces";

const request = require("supertest");

import app from "../../server/app";
import {AMongoDb, MongoInMemory} from "../../server/mongodb";

import {IConfig} from "../../config/config.interface";
let config: IConfig = require('../../config/config.dev.json');

describe("User URL Tests", () => {
	let userEmail: string;
	let userFirstName: string;
	let userId: string;
	let userLastName: string;
	let userRating: number;
	let userRatingState: string;
	let userRole: string;
	let userState: string;
	let mongodb: AMongoDb;

	beforeAll(async done => {
		mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
		mongodb.connect()
			.then(() => {
				console.log(`MongoDB Server running`);
				done();
			})
			.catch((err: any) => {
				done (err);
			})
		done();
	});

	// afterEach(async done => {
	// 	await mongodb.clear();
	// 	done();
	// });

	afterAll(async done => {
		await mongodb.close();
		done();
	});
	describe("Canonical Tests", () => {
		it('this pipeline', async done => {
			expect(1+1).toEqual(2);
			done();
		});
		it("Swiss Pairing up and running", async () => {
			return request(app)
				.get("/hello")
				.then((response: any) => {
					expect(response.statusCode).toBe(200);
					expect(response.text).toEqual("Swiss Pairing up and running!")
				});
		});
		it("should `CREATE` a user", async () => {
			let userNew: IUserCreate = {
				firstName: "Marco",
				lastName: "Maciel",
				email: "Marco.Maciel@yahoo.com",
				password: "CuXK3mv^10c2"
			}
			return request(app)
				.post("/user")
				.send(userNew)
				.then((response: any) => {
					expect(response.statusCode).toBe(201);
					expect(response.body.firstName).toEqual("Marco")
					expect(response.body.lastName).toEqual("Maciel")
					expect(response.body.email).toEqual("Marco.Maciel@yahoo.com")
					userEmail = response.body.email;
					userFirstName = response.body.firstName;
					userId = response.body.id;
					userLastName = response.body.lastName;
					userRating = response.body.rating;
					userRatingState  = response.body.ratingState;
					userRole = response.body.role;
					userState = response.body.state;
				});
		});
		it("should `READ` a user", async () => {
			return request(app)
				.get(`/user/${userId}`)
				.then((response: any) => {
					expect(response.statusCode).toBe(200);
					expect(response.body.firstName).toEqual(userFirstName)
					expect(response.body.lastName).toEqual(userLastName)
					expect(response.body.email).toEqual(userEmail)
					expect(response.body.rating).toEqual(userRating)
					expect(response.body.ratingState).toEqual(userRatingState)
					expect(response.body.role).toEqual(userRole)
					expect(response.body.state).toEqual(userState)
				});
		});
		it("should `PATCH` a user", async () => {
			let userPatch: IUserPatch = {
				"firstName": "Serafino"
			}
			return request(app)
				.patch(`/user/${userId}`)
				.send(userPatch)
				.then((response: any) => {
					expect(response.statusCode).toEqual(200);
					expect(response.body.firstName).toEqual(userPatch.firstName)
				});
		});
	});
});