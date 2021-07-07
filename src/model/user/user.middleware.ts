import express from 'express';

// todo: change it to service
import * as utils from "../../utils/utils";
import {UserUtil} from "./user.util";
import {USER_CREATE_KEYS, USER_PATCH_KEYS} from "./user.interfaces";
import {hasOnlyRequiredKeys} from "../../utils/utils";


export class UserMiddleware {
	private static instance: UserMiddleware;
	private static userUtil = UserUtil.getInstance();

	static getInstance() {
		if (!UserMiddleware.instance) {
			UserMiddleware.instance = new UserMiddleware();
		}
		return UserMiddleware.instance;
	}

	async entityExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (await UserMiddleware.userUtil.lEntityExists(req.body.id)) {
			next()
		} else {
			res.status(400).send(`User id not found: ${req.body.id}`);
		}
	}
	
	// User create request has required user attributes
	hasRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let missingAttributes = utils.hasRequiredKeys(req.body, USER_CREATE_KEYS);
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasRequiredCreateAttributes/message: ' + missingAttributes + '\n');
				res.status(400).send(`User create request missing required attributes: ${missingAttributes}`);
			} else {
				// console.log('\n' + 'PlayerMiddleware/validateRequiredBodyFields/message: All required attributes present' + '\n');
				next()
			}
		}else {
			res.status(400).send(`User  create request does not include any attributes`);
		}
	}
	
	// User create request has only required attributes
	async hasOnlyRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let errorMessage = utils.hasOnlyRequiredKeys(req.body, USER_CREATE_KEYS);
			if (errorMessage.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasOnlyRequiredCreateAttributes/message: ' + errorMessage + '\n');
				res.status(400).send(`User create request has invalid attributes: ${errorMessage}`);
			} else {
				// console.log('\n' + 'UserMiddleware/hasOnlyRequiredCreateAttributes/message: All required attributes present' + '\n');
				next()
			}
		}else {
			res.status(400).send(`User create request does not include any attributes`);
		}
	}

	async hasOnlyValidPatchAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let errorMessage = hasOnlyRequiredKeys(req.body, USER_PATCH_KEYS);
			if (errorMessage.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasOnlyValidPatchAttributes/message: ' + errorMessage + '\n');
				res.status(400).send(`User path request has invalid attributes:  ${errorMessage}`);
			} else {
				// console.log('\n' + 'UserMiddleware/hasOnlyValidPatchAttributes/message: All path attributes are valid' + '\n');
				next()
			}
		}else {
			res.status(400).send(`User path request does not include any attributes`);
		}
	}
	
	async emailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.email && !utils.isValidEmail(req.body.email)) {
			res.status(400).send(`Invalid user email: ` + req.body.email);
		} else {
			next();
		}
	}
	
	async emailIsUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
		let exists = await UserMiddleware.userUtil.lEmailExists(req.body.email);
		if (exists) {
			res.status(400).send(`User email already exists:  ${req.body.email}`);
		} else {
			next();
		}
	}
	
	async passwordIsStrong(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.password) {
			next();
		} else {
			if (false == await utils.isPasswordStrong(req.body.password)) {
				res.status(400).send(`User password is weak: ${req.body.password}`);
			} else {
				next();
			}
		}
	}
	
	async roleIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.role) {
			let errorMessage = UserMiddleware.userUtil.lRoleIsValid(req.body.role);
			if(UserMiddleware.userUtil.lRoleIsValid(req.body.role)) {
				next()
			} else {
				res.status(400).send(`User role, ${req.body.role}, is not valid`);
			}
		} else {
			next();
		}
	}
	
	// rating must be numeric
	async ratingIsNumeric(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.rating) {
			if(utils.isStringNumeric(req.body.rating)) {
				next()
			} else {
				res.status(400).send(`User rating, ${req.body.rating}, is not numeric`);
			}
		} else {
			next()
		}
	}
	
	// rating is between USER_RATING.MINIMUM and USER_RATING.MAXIMUM
	async ratingIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.rating) {
			let errorMessage = UserMiddleware.userUtil.lRatingIsValid(req.body.rating);
			if (errorMessage.length === 0) {
				next()
			} else {
				res.status(400).send( errorMessage);
			}
		} else {
			next()
		}
	}
	
	// rating state is valid
	async ratingStateIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.ratingState) {
			if(UserMiddleware.userUtil.lRatingStateIsValid(req.body.ratingState)) {
				next()
			} else {
				res.status(400).send(`User rating state, ${req.body.ratingState}, is not valid`);
			}
		} else {
			next()
		}
	}
	
	// state is valid
	async stateIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.state) {
			if(UserMiddleware.userUtil.lStateIsValid(req.body.state)) {
				next()
			} else {
				res.status(400).send(`User state, ${req.body.state}, is not valid`);
			}
		} else {
			next()
		}
	}
	
	async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
		req.body.id = req.params.userId;
		next();
	}

	async serviceDoesNotSupportPut(req: express.Request, res: express.Response) {
		res.status(404).send(`This service does not support PUT`);
	}
	
	async serviceDoesNotSupportDelete(req: express.Request, res: express.Response) {
		res.status(404).send(`This service does not support DELETE`);
	}
}
export default UserMiddleware.getInstance();
