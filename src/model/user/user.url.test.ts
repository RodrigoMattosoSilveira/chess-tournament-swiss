const axios = require('axios');
import {AxiosResponse} from "axios";

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
	let swissPairingURI: string = `${config.swissPairingURL}:${config.expressServerPort}`

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

	afterEach(async done => {
		await mongodb.clear();
		done();
	});

	afterAll(async done => {
		await mongodb.close();
		done();
	});
	describe("Canonical Tests", () => {
		it('this pipeline', async done => {
			expect(1+1).toEqual(2);
			done();
		});
		it("Swiss Pairing up and running", async done => {
			await axios.get('/hello')
			.then(function (response: AxiosResponse) {
				console.log(`Got reply:  ${response.data}`);
				expect(response.data).toEqual("Swiss Pairing up and running!")
			})
			.catch(function (error: any) {
				console.log(error);
			});
			done();
		});
		it("should `CREATE` a user", async done => {
			await axios.post(`${swissPairingURI}/user/`, {
				firstName: "Marco",
				lastName: "Maciel",
				email: "Marco.Maciel@yahoo.com",
				password: "CuXK3mv^10c2"
			})
			.then(function (response: AxiosResponse) {
				// console.log(response);
				console.log("Created user: " + response.data);
				expect(response.data.firstName).toEqual("Marco")
				expect(response.data.lastName).toEqual("Maciel")
				expect(response.data.email).toEqual("Marco.Maciel@yahoo.com")
				userEmail = response.data.email;
				userFirstName = response.data.firstName;
				userId = response.data.id;
				userLastName = response.data.lastName;
				userRating = response.data.rating;
				userRatingState  = response.data.ratingState;
				userRole = response.data.role;
				userState = response.data.state;
				done();
			})
			.catch(function (error: any) {
				console.log(error);
				expect(1+1).toEqual(3)
				done();
			});
			done();
		});
		// it("should `READ` a user", async done => {
		// 	await axios.get(`http://localhost:3000/user/` + userId)
		// 		.then(function (response: AxiosResponse) {
		// 			// console.log(response);
		// 			expect(response.data.firstName).toEqual("Marco")
		// 			expect(response.data.lastName).toEqual("Maciel")
		// 			expect(response.data.email).toEqual("Marco.Maciel@yahoo.com")
		// 			done();
		// 		})
		// 		.catch(function (error: any) {
		// 			console.log(error);
		// 			expect(false).toEqual(true)
		// 			done();
		// 		});
		// 	done();
		// });
	});
});