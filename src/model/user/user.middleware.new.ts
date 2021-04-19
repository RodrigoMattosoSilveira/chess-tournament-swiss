import express from 'express';
import shortid from "shortid";

// todo: change it to service
import userService from './user.service';
import {user_states} from "../../contants/contants";
import {EMAIL_VALIDATION, USER_DEFAULT_CONSTANTS, USER_RATING, USER_RATING_STATE, USER_ROLE} from "./user.constants"
import {isStringNumeric, isValidEmail} from "../../utils/utils";
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
	
	// User create request has required user attributes
	async hasRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let missingAttributes = this.lHasRequiredCreateAttributes(req.body)
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasRequiredCreateAttributes/message: ' + missingAttributes + '\n');
				res.status(400).send({error: `User create request missing required attributes: `} + missingAttributes);
			} else {
				// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/message: All required attributes present' + '\n');
				next()
			}
		}else {
			res.status(400).send({error: `User  create request does not include any attributes`});
		}
	}
	
	// User create request has only required attributes
	async hasOnlyRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let errorMessage = this.lHasOnlyRequiredCreateAttributes(req.body)
			if (errorMessage.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasOnlyRequiredCreateAttributes/message: ' + errorMessage + '\n');
				res.status(400).send({error: `User create request has invalid attributes: `} + errorMessage);
			} else {
				// console.log('\n' + 'UserMiddleware/hasOnlyRequiredCreateAttributes/message: All required attributes present' + '\n');
				next()
			}
		}else {
			res.status(400).send({error: `User create request does not include any attributes`});
		}
	}
	
	// User patch request has valid attributes
	async hasValidPatchAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let nonPatchableAttributes = this.lHasValidPatchAttributes(req.body)
			if (nonPatchableAttributes.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasValidPatchAttributes/message: ' + missingAttributes + '\n');
				res.status(400).send({error: `User patch request has invalid attributes: `} + nonPatchableAttributes);
			} else {
				// console.log('\n' + 'UserMiddleware/hasValidPatchAttributes/message: All required attributes present' + '\n');
				next()
			}
		}else {
			res.status(400).send({error: `User patch request does not include any attributes`});
		}
	}
	
	async emailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.email && !isValidEmail(req.body.email)) {
			res.status(400).send({error: `Invalid user email: ` + req.body.email});
		} else {
			next();
		}
	}
	
	async emailIsUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!await this.lEmailExists(req.body.email)) {
			next()
		} else {
			res.status(400).send({error: `User email already exists: ` + req.body.id});
		}
	}
	
	async roleIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		let errorMessage = this.lRatingIsValid(req.body.role);
		if (errorMessage.length === 0) {
			next()
		} else {
			res.status(400).send({error: errorMessage});
		}
	}
	
	// rating must be numeric
	async ratingIsNumeric(req: express.Request, res: express.Response, next: express.NextFunction) {
		if(isStringNumeric(req.body.rating)) {
			next()
		} else {
			res.status(400).send({error: `User rating, ${req.body.rating}, is not numberic`});
		}
	}
	
	// rating is between USER_RATING.MINIMUM and USER_RATING.MAXIMUM
	async ratingIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	// rating state is valid
	async ratingStateIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	// state is valid
	async stateIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	//****************************** Auxiliary methods for testing purposes *******************************************
	/**
	 * lAddAttributeDefaults Fills up req.body generated attributes with their default values
	 * @param req
	 */
	lAddAttributeDefaults = (req: any) => {
		req.body.id =  shortid.generate();
		req.body.role = USER_DEFAULT_CONSTANTS.ROLE;
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
	 * @param body - the request body attributes
	 * @returns string, empty if all required attributes are present, the list of missing attributes otherwise
	 */
	lHasRequiredCreateAttributes (body: any): string {
		let errorMessage: string = "";
		let bodyKeys = Object.keys(body);
		for (let requiredAttribute of requiredCreateAttributes) {
			if (bodyKeys.findIndex(key => key===requiredAttribute) === -1) {
				if (errorMessage.length > 0) {
					errorMessage += ', ';
				}
				errorMessage += requiredAttribute;
			}
		}
		return errorMessage
	}
	
	/**
	 * lHasOnlyRequiredCreateAttributes
	 * @param body, the request body attributes
	 * @returns string, empty if all attributes are valid, the list of invalid attributes otherwise
	 */
	lHasOnlyRequiredCreateAttributes(body: any): string {
		let errorMessage: string = "";
		let bodyKeys = Object.keys(body);
		for (let bodyKey of bodyKeys) {
			if (requiredCreateAttributes.findIndex(key => key===bodyKey) === -1) {
				if (errorMessage.length > 0) {
					errorMessage += ', ';
				}
				errorMessage += bodyKey;
			}
		}
		return errorMessage
	}
	
	/**
	 * lHasValidPatchAttributes
	 * @param body, the request body attributes
	 * @returns string, empty if all attributes are valid, the list of invalid attributes otherwise
	 */
	lHasValidPatchAttributes(body: any): string {
		let errorMessage: string = "";
		let bodyKeys = Object.keys(body);
		for (let bodyKey of bodyKeys) {
			if (patchableAttributes.findIndex(key => key===bodyKey) === -1) {
				if (errorMessage.length > 0) {
					errorMessage += ', ';
				}
				errorMessage += bodyKey;
			}
		}
		return errorMessage
	}
	
	/**
	 * lRoleIsValid, the user role
	 * @param role
	 * @returns boolean, true if roles valid,false otherwise
	 */
	lRoleIsValid(role: string): boolean {
		let valid: boolean = true;
		const upperCaseRole = role.toUpperCase();
		let roles = Object.keys(USER_ROLE);
		const upperCaseRoles = roles.map(x => x.toUpperCase());
		if (upperCaseRoles.findIndex(key => key===upperCaseRole) === -1) {
			valid = false
		}
		return valid;
	}
	
	/**
	 * lRatingIsValid, must be numeric, and be between USER_RATING.MINIMUM and USER_RATING.MAXIMUM
	 * @param rating, empty string is valid, error message otherwise
	 */
	lRatingIsValid(rating: string): string {
		let errorMessage: string = "";
		const nRating: number = +rating;
		if (nRating < USER_RATING.MINIMUM) {
			errorMessage = "User rating, " + rating + ", is less than minimum, " + USER_RATING.MINIMUM;
		} else {
			if (nRating > USER_RATING.MAXIMUM) {
				errorMessage = "User rating, " + rating + ", is greater than maximum, " + USER_RATING.MAXIMUM;
			}
		}
		return errorMessage
	}
	
	/**
	 * lRatingStateIsValid, the user role
	 * @param rate state
	 * @returns boolean, true if rate state valid,false otherwise
	 */
	lRatingStateIsValid(ratingState: string): boolean {
		let valid: boolean = true;
		const upperCaseRatingState = ratingState.toUpperCase();
		let ratingStates = Object.keys(USER_RATING_STATE);
		const upperCaseRatingStates = ratingStates.map(x => x.toUpperCase());
		if (upperCaseRatingStates.findIndex(key => key===upperCaseRatingState) === -1) {
			valid = false
		}
		return valid;
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


