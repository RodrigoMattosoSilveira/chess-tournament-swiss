import {AxiosResponse} from "axios";
const axios = require('axios');

describe("User URL Tests", () => {
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
					expect(response.data.lastName).toEqual("Marco.Maciel")
					done();
				})
				.catch(function (error: any) {
					console.log(error);
					done();
				});
			done();
		});
	});
});