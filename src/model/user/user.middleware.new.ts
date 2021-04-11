import express from 'express';
import shortid from "shortid";

// todo: change it to service
import userService from './user.service';
import {user_states} from "../../contants/contants";
import {USER_CONSTANTS} from "./user.constants"


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
	
	// It is a valid email string and is not in use
	async createEmailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	// It is a valid email string and is not in use
	async emailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	async emailIsUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	async entityExists(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	async entityDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
	}
	
	// required create attributes are present and valid
	async hasRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
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
	
	lAddAttributeDefaults = (req: any) => {
		req.body.id =  shortid.generate();
		req.body.permissionLevel = USER_CONSTANTS.DEFAULT_PERMISSION;
		req.body.rating = USER_CONSTANTS.DEFAULT_RATING;
		req.body.ratingState = USER_CONSTANTS.DEFAULT_RATING_STATE;
		req.body.state = USER_CONSTANTS.DEFAULT_STATE;
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


