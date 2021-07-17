import {AxiosResponse} from "axios";
const axios = require('axios');

describe("User URL Tests", () => {
	let userEmail: string;
	let userFirstName: string;
	let userId: string;
	let userLastName: string;
	let userPassword: string;
	let userRating: number;
	let userRatingState: string;
	let userRole: string;
	let userState: string;
	describe("Canonical Tests", () => {
		it('this pipeline', async done => {
			expect(1+1).toEqual(2);
			done();
		});
		it("app is running", async done => {
			await axios.get('http://localhost:3000/')
			.then(function (response: AxiosResponse) {
				// console.log(response);
				console.log(`Got reply:  ${response.data}`);
				expect(response.data).toEqual("Server up and running!")
			})
			.catch(function (error: any) {
				console.log(error);
			});
			done();
		});
		it("should `CREATE` a user", async done => {
			await axios.post('http://localhost:3000/user', {
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
				expect(false).toEqual(true)
				done();
			});
			done();
		});
		it("should `READ` a user", async done => {
			await axios.get(`http://localhost:3000/user/` + userId)
				.then(function (response: AxiosResponse) {
					// console.log(response);
					expect(response.data.firstName).toEqual("Marco")
					expect(response.data.lastName).toEqual("Maciel")
					expect(response.data.email).toEqual("Marco.Maciel@yahoo.com")
					done();
				})
				.catch(function (error: any) {
					console.log(error);
					expect(false).toEqual(true)
					done();
				});
			done();
		});
	});
});