import express from 'express';
import shortid from "shortid";

// todo: change it to service
import userService from './user.service';
import {user_states} from "../../contants/contants";
import {EMAIL_VALIDATION, USER_DEFAULT_CONSTANTS} from "./user.constants"
import {isValidEmail} from "../../utils/utils";
import userDao from './user.dao';
import {EmailValidationCodeT, requiredCreateAttributes, patchableAttributes} from "./user.interfaces";


export class UserMiddleware {
	private static instance: UserMiddleware;
	
	static getInstance() {
		if (!UserMiddleware.instance) {
			UserMiddleware.instance = new UserMiddleware();
		}
		return UserMiddleware.instance;
	}
	
	async addAttributeDefaults(req: express.Request, res: express.Response, next: express.NextFunction) {
		this.lAddAttributeDefaults(req);
		next();
	}
	
	// It is a valid email string and it is unique
	async createEmailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		switch(await this.lCreateEmailIsValid(req.body.email)) {
			case  EMAIL_VALIDATION.VALID:
				next();
				break;
			case EMAIL_VALIDATION.INVALID:
				res.status(400).send({error: `Invalid user email: ` + req.body.email});
				break;
			case EMAIL_VALIDATION.ALREADY_EXISTS:
				res.status(400).send({error: `New user email already exists: ` + req.body.email});
				break;
		}
	}
	
	async entityExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (await this.lEntityExists(req.body.id)) {
			next()
		} else {
			res.status(400).send({error: `User id not found: ` + req.body.id});
		}
	}
	
	async entityDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!await this.lEntityExists(req.body.id)) {
			next()
		} else {
			res.status(400).send({error: `User id already exists: ` + req.body.id});
		}
	}
	
	// required create attributes are present and valid
	async hasRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let missingAttributes = this.lHasRequiredCreateAttributes(req.body)
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/message: ' + missingAttributes + '\n');
				res.status(400).send({error: `Missing required user attributes: `} + missingAttributes);
			} else {
				// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/message: All required attributes present' + '\n');
				next()
			}
		}else {
			res.status(400).send({error: `User requirement body is missing`});
		}
	}
	
	//provided patch attributes are valid
	async hasValidPatchAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	async permissionLevelIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	// rating must be numeric, be between 0 and 3000 (no one in the world is rated above 3000)
	async ratingIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	// If provided, it is a valid email string and is not in use
	async patchEmailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	//****************************** Auxiliary methods for testing purposes *******************************************
	/**
	 * lAddAttributeDefaults Fills up req.body generated attributes with their default values
	 * @param req
	 */
	lAddAttributeDefaults = (req: any) => {
		req.body.id =  shortid.generate();
		req.body.permissionLevel = USER_DEFAULT_CONSTANTS.PERMISSION;
		req.body.rating = USER_DEFAULT_CONSTANTS.RATING;
		req.body.ratingState = USER_DEFAULT_CONSTANTS.RATING_STATE;
		req.body.state = USER_DEFAULT_CONSTANTS.STATE;
	}
	
	/**
	 * lCreateEmailIsValid Validates whether a string is a valid email and, if so, is unique
	 * @param email
	 * @returns EmailValidationCodeT
	 */
	async lCreateEmailIsValid (email: string): Promise<EmailValidationCodeT> {
		let emailValidationCode: EmailValidationCodeT = EMAIL_VALIDATION.VALID
		
		if (!isValidEmail(email)) {
			emailValidationCode = EMAIL_VALIDATION.INVALID
		} else {
			if (await this.lEmailExists(email)) {
				emailValidationCode = EMAIL_VALIDATION.ALREADY_EXISTS;
			}
		}
		// console.log("lCreateEmailIsValid: " + email + ", results in: " + emailValidationCode)
		return emailValidationCode;
	}
	
	/**
	 * lEmailExists Searches the database for an entity with the given email
	 * @param email, the email of the sought entity
	 * @returns boolean, true if an entity with this email exists, false otherwise
	 */
	async lEmailExists (email: string): Promise<boolean> {
		return await userDao.emailExists(email);
	}
	
	/**
	 * lEntityExists Searches the database for an entity with the given id
	 * @param id, the id of the sought entity
	 * @returns boolean, true if an entity with this id exists, false otherwise
	 */
	async lEntityExists (id: string): Promise<boolean> {
		return  await userDao.idExists(id);
	}
	
	/**
	 * lHasRequiredCreateAttributes
	 * @param body - the request body attribute
	 * @returns string, empty if all required attributes are present, the list of missing attributes otherwise
	 */
	lHasRequiredCreateAttributes (body: any): string {
		let missingAttributes: string = "";
		for (let i = 0; i < requiredCreateAttributes.length; i < i++) {
			let requiredAttribute = requiredCreateAttributes[i];
			// @ts-ignore
			if (!body[requiredAttribute]) {
				if (missingAttributes.length > 0) {
					missingAttributes += ', ';
				}
				missingAttributes += requiredAttribute;
			}
		}
		return missingAttributes
	}
	
	lHasValidPatchAttributes(body: any): string {
		let nonPatchableAttributes: string = "";
		let bodyKeys = Object.keys(body);
		for (let i = 0; i < bodyKeys.length; i < i++) {
			let bodyKey: string = bodyKeys[i];
			if (patchableAttributes.findIndex(key => key===bodyKey) === -1) {
				if (nonPatchableAttributes.length > 0) {
					nonPatchableAttributes += ', ';
				}
				nonPatchableAttributes += bodyKey;
			}
		}
		return nonPatchableAttributes
	}
}
export default UserMiddleware.getInstance();


/**
 * Asserts whether value is a supported user state value
 * @param value
 * @return -1 if value is not a supported user state , non-negative value if so.
 */
const isStateSupported = (value: string): boolean => {
	let _value = value.toLowerCase();
	// console.log('\n' + 'UserMiddleware/isStateSupported/value: ' + _value + '\n');
	// console.log('\n' + 'UserMiddleware/isStateSupported/user_states: ' + JSON.stringify(user_states) + '\n');
	return user_states.findIndex((aValidType: string) => aValidType === _value) !== -1;
}


