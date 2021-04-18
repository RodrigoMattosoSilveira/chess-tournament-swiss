export class Utils {
	/**
	 * Helper function to patch a USER and return the response object
	 * @param agent
	 * @param url
	 * @param patch
	 * @return response
	 */
	public patchEntity = async (agent: any, url: string, patch: any): Promise<any> => {
		// console.log ('Utils.patchEntity/url: ' + url);
		// console.log ('Utils.patchEntity/url: ' + JSON.stringify(patch));
		return await agent
			.patch(url)
			.send(patch)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
	}
	
	/**
	 * Returns true is points is numeric, false otherwise
	 * @param value
	 * @return boolean
	 */
	public isStringNumeric = (value: string): boolean => {
		return !isNaN(Number(value))
	}
}

/**
 *
 * @param value
 * @return boolean, true if value is numeric , false otherwise
 */
export const isStringNumeric = (value: string): boolean => {
	return !isNaN(Number(value))
}

/**
 * Validate that the argument is a valid mm/dd/yyyy date
 * https://regexlib.com/RETester.aspx?regexp_id=112 / https://www.regextester.com/ / https://regex101.com/
 *
 * @param value
 * @return boolean, true if value represents a valid date, false otherwise
 */
export const isValidDate = (value: string): boolean => {
	console.log("\nUtils/isValidDate: " + value + "\n");
	const regexp =new RegExp(/^((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}$/g);
	return regexp.test(value);
}

/**
 * isValidEmail
 * https://emailregex.com/
 * @param value
 * @return boolean, true if value represents a valid email, false otherwise
 */
export const isValidEmail = (value: string): boolean => {
	// console.log('\n' + 'Utils/isValidEmail: ' + value + '\n');
	let validEmail: boolean = true;
	const regexp = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
	if (!regexp.test(value)) {
		validEmail = false;
	}
	return validEmail;
}
