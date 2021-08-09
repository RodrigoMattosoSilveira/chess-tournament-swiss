import {
	isValidEmail,
	isStringNumeric,
	isValidDate,
	isPasswordStrong,
	hasRequiredKeys,
	hasOnlyRequiredKeys,
	isCityValid,
	isStringLongEnough, isCountryValid, isNumericIntervalValid
} from "./utils";
import {keys} from "ts-transformer-keys";

describe('Util Unit Tests', () => {
	let SOMETHING_KEYS: string[];
	describe('Validate that a string contains only numeric characters', () => {
		it('a valid string', async done => {
			const testString: string = "1234567890";
			expect(isStringNumeric(testString)).toEqual(true);
			done();
		});
		it('an invalid string', async done => {
			const testString: string = "1234a67890";
			expect(isStringNumeric(testString)).toEqual(false);
			done();
		});
	});
	describe('Validate that a string contains a valid email address', () => {
		it('a valid email address', async done => {
			const testString: string = "a.b@c.com";
			expect(isValidEmail(testString)).toEqual(true);
			done();
		});
		it('an invalid email address, no @', async done => {
			const testString: string = "a.b&c.com";
			expect(isValidEmail(testString)).toEqual(false);
			done();
		});
		it('an invalid email address, no string after the .', async done => {
			const testString: string = "a.b@c.";
			expect(isValidEmail(testString)).toEqual(false);
			done();
		});
	})
	describe('Validate that a string contains a valid date', () => {
		it('a valid date', async done => {
			const testString: string = "1/1/1970";
			expect(isValidDate(testString)).toEqual(true);
			done();
		});
		it('an invalid date', async done => {
			const testString: string = "1/a/1970";
			expect(isValidDate(testString)).toEqual(false);
			done();
		});
	})
	describe('Validate password strength', () => {
		it('meets criteria', async done => {
			const password: string = "U1a!qwe3";
			expect(isPasswordStrong(password)).toEqual(true);
			done();
		});
		it('not long enough', async done => {
			const password: string = "U1a!qwe";
			expect(isPasswordStrong(password)).toEqual(false);
			done();
		});
		it('missing upper case', async done => {
			const password: string = "u1a!qwe";
			expect(isPasswordStrong(password)).toEqual(false);
			done();
		});
		it('missing number', async done => {
			const password: string = "Uda!qwew";
			expect(isPasswordStrong(password)).toEqual(false);
			done();
		});
		it('missing lower case', async done => {
			const password: string = "UdA!QQQQ";
			expect(isPasswordStrong(password)).toEqual(false);
			done();
		});
		it('missing special character', async done => {
			const password: string = "UdA1qqqq";
			expect(isPasswordStrong(password)).toEqual(false);
			done();
		});
	});

	describe('Validate has Required Keys', () => {
		beforeAll(() => {
			interface ISomething {
				email: string;
				firstName: string;
				lastName: string;
				password: string;
			}
			SOMETHING_KEYS = keys<ISomething>();
		});
		it('expected keys are present', async done => {
			let body:any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			expect(hasRequiredKeys(body, SOMETHING_KEYS)).toEqual("")
			done();
		});
		it('a key is missing', async done => {
			let body: any = {
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			expect(hasRequiredKeys(body, SOMETHING_KEYS)).toEqual("email")
			done();
		});
		it('a few keys are missing', async done => {
			let body: any = {
				email: "a.b@c.com",
				lastName: "White",
			}
			expect(hasRequiredKeys(body, SOMETHING_KEYS)).toEqual("firstName, password")
			done();
		});
	});
	describe('Validate has only Required Keys', () => {
		beforeAll(() => {
			interface ISomething {
				email: string;
				firstName: string;
				lastName: string;
				password: string;
			}
			SOMETHING_KEYS = keys<ISomething>();
		});
		it('expected keys are present', async done => {
			let body:any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut"
			}
			expect(hasOnlyRequiredKeys(body, SOMETHING_KEYS)).toEqual("")
			done();
		});
		it('an expected key is present', async done => {
			let body:any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut",
				unexpected: "unexpected"
			}
			expect(hasOnlyRequiredKeys(body, SOMETHING_KEYS)).toEqual("unexpected")
			done();
		});
		it('multiple expected keys are present', async done => {
			let body:any = {
				email: "a.b@c.com",
				firstName: "John",
				lastName: "White",
				password: "ThoughToFigureOut",
				unexpected: "unexpected",
				anotherUnexpected: "anotherUnexpected"
			}
			expect(hasOnlyRequiredKeys(body, SOMETHING_KEYS)).toEqual("unexpected, anotherUnexpected")
			done();
		});
	});
	describe('Validate the city find method', () => {
		it('finds an existing city', async done => {
			let city: string = "Tokyo";
			let cityIsValid = isCityValid(city);
			expect(cityIsValid).toBe(true);
			done();
		})
		it('doe find a non existing city', async done => {
			let city: string = "Tokyoo";
			let cityIsValid = isCityValid(city);
			expect(cityIsValid).toBe( false);
			done();
		})
	});
	describe('Validate string length validator', () => {
		it('valid length', async done => {
			let myString: string = "A very long string with many characters";
			expect(isStringLongEnough(myString, 15)).toBe(true);
			done();
		})
		it('valid length', async done => {
			let myString: string = "A  string";
			expect(isStringLongEnough(myString, 15)).toBe(false);
			done();
		})
	})
	describe('Validate the country find method', () => {
		it('finds an existing country', async done => {
			let country: string = "Austria";
			let countryIsValid = isCountryValid(country);
			expect(countryIsValid).toBe(true);
			done();
		})
		it('doe find a non existing country', async done => {
			let country: string = "Austriaaaa";
			let countryIsValid = isCountryValid(country);
			expect(countryIsValid).toBe(false);
			done();
		})
	});
	describe('Validate the isNumericIntervalValid method', () => {
		it('left less than right, they can match', async done => {
			let leftSide: number = 1;
			let rightSide: number = 2;
			let lessOrEqual: boolean = true;
			expect(isNumericIntervalValid(leftSide, rightSide, lessOrEqual)).toBe(true);
			done();
		})
		it('left less than right, they cannot match', async done => {
			let leftSide: number = 1;
			let rightSide: number = 2;
			let lessOrEqual: boolean = false;
			expect(isNumericIntervalValid(leftSide, rightSide, lessOrEqual)).toBe(true);
			done();
		})
		it('left equal than right, they can match', async done => {
			let leftSide: number = 1;
			let rightSide: number = 1;
			let lessOrEqual: boolean = true;
			expect(isNumericIntervalValid(leftSide, rightSide, lessOrEqual)).toBe(true);
			done();
		})
		it('left equal than right, they cannot match', async done => {
			let leftSide: number = 1;
			let rightSide: number = 1;
			let lessOrEqual: boolean = false;
			expect(isNumericIntervalValid(leftSide, rightSide, lessOrEqual)).toBe(false);
			done();
		})
		it('left greater than right, they cann match', async done => {
			let leftSide: number = 2;
			let rightSide: number = 1;
			let lessOrEqual: boolean = true;
			expect(isNumericIntervalValid(leftSide, rightSide, lessOrEqual)).toBe(false);
			done();
		})
		it('left greater than right, they cannot match', async done => {
			let leftSide: number = 2;
			let rightSide: number = 1;
			let lessOrEqual: boolean = false;
			expect(isNumericIntervalValid(leftSide, rightSide, lessOrEqual)).toBe(false);
			done();
		})
	});
});