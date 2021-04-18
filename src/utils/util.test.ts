import {isValidEmail, isStringNumeric, isValidDate} from "./utils";

describe('Util Unit Tests', () => {
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
});
