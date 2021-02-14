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

export const isStringNumeric = (value: string): boolean => {
	return !isNaN(Number(value))
}

/**
 * Validate that the argument is a valid mm/dd/yyyy date
 * https://regexlib.com/RETester.aspx?regexp_id=112 / https://www.regextester.com/ / https://regex101.com/
 *
 * @param value
 * @return boolean
 */
export const isValidDate = (value: string): boolean => {
	console.log("\nUtils/isValidDate: " + value + "\n");
	const regexp =new RegExp(/^((((0[13578])|([13578])|(1[02]))[\/](([1-9])|([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\/](([1-9])|([0-2][0-9]))))[\/]\d{4}$|^\d{4}$/g);
	return regexp.test(value);
}
