import {USER_CREATE_KEYS} from "../model/user/user.interfaces";

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
	// console.log("\nUtils/isValidDate: " + value + "\n");
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

/**
 * Assess whether a password satisfied the following criteria
 * - it is longer than 7 characters
 * - it has at least one upper case character
 * - it has at least one number
 * - it has at least one lower case character
 * - it has at least one special character
 *
 * @param password
 * @return boolean, true if password meets criteria, false otherwise
 */
export const isPasswordStrong = (password: string): boolean => {
	// let strengthCounter: number = 0;
	let passwordIsStrong: boolean = true;
	
	// To avoid TS7053
	// https://stackoverflow.com/questions/56833469/typescript-error-ts7053-element-implicitly-has-an-any-type
	let strengthValue: {[key: string]:boolean}= {
		UPPERCASE: false,
		LENGTH: false,
		SPECIAL: false,
		NUMBERS: false,
		LOWERCASE: false
	};
	
	if(password.length >= 8) {
		strengthValue.LENGTH = true;
		for(let index=0; index < password.length; index++) {
			let char = password.charCodeAt(index);
			if(!strengthValue.UPPERCASE && char >= 65 && char <= 90) {
				strengthValue.UPPERCASE = true;
			} else if(!strengthValue.NUMBERS && char >=48 && char <= 57){
				strengthValue.NUMBERS = true;
			} else if(!strengthValue.LOWERCASE && char >=97 && char <= 122){
				strengthValue.LOWERCASE = true;
			} else if(!strengthValue.SPECIAL && (char >=33 && char <= 47) || (char >=58 && char <= 64)) {
				strengthValue.SPECIAL = true;
			}
		}
	}
	
	for (let key of Object.keys(strengthValue)) {
		passwordIsStrong = passwordIsStrong && strengthValue[key];
	}
	
	return passwordIsStrong;
}

/**
 * hasRequiredKeys - validates that an tuple contains the required keys
 * @param body - an Key:Value tuple
 * @param requiredKeys - An array of string required keys
 * @return boolean, empty if the required keys are in the tuple, the missing keys otherwise
 */
export const hasRequiredKeys = (body: any, requiredKeys: string[]): string => {
	let errorMessage: string = "";
	let bodyKeys = Object.keys(body);
	for (let requiredKey of requiredKeys) {
		if (bodyKeys.findIndex(key => key===requiredKey) === -1) {
			if (errorMessage.length > 0) {
				errorMessage += ', ';
			}
			errorMessage += requiredKey;
		}
	}
	return errorMessage
}

/**
 * hasRequiredKeys - validates that an tuple contains the required keys
 * @param body - an Key:Value tuple
 * @param requireKeys - An array of string required keys
 * @return boolean, empty if only required keys are in the tuple, the non required keys otherwise
 */
export const hasOnlyRequiredKeys = (body: any, requireKeys: string[]): string => {
	let errorMessage: string = "";
	let bodyKeys = Object.keys(body);
	for (let bodyKey of bodyKeys) {
		if (requireKeys.findIndex(key => key===bodyKey) === -1) {
			if (errorMessage.length > 0) {
				errorMessage += ', ';
			}
			errorMessage += bodyKey;
		}
	}
	return errorMessage
}
