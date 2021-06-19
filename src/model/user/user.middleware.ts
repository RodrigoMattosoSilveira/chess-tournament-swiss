import express from 'express';
import shortid from "shortid";

// todo: change it to service
import {EMAIL_VALIDATION, USER_DEFAULT_CONSTANTS, USER_RATING, USER_RATING_STATE, USER_ROLE, USER_STATE} from "./user.constants"
import * as utils from "../../utils/utils";
import userDao from './user.dao';
import {EmailValidationCodeT, requiredCreateAttributes, patchableAttributes} from "./user.interfaces";
import { DaoResult } from "../../common/generic.interfaces";
import {UserUtil} from "./user.util";


export class UserMiddleware {
	private static instance: UserMiddleware;
	private static userUtil = UserUtil.getInstance();

	static getInstance() {
		if (!UserMiddleware.instance) {
			UserMiddleware.instance = new UserMiddleware();
		}
		return UserMiddleware.instance;
	}
	
	async addAttributeDefaults(req: express.Request, res: express.Response, next: express.NextFunction) {
		UserMiddleware.userUtil.lAddAttributeDefaults(req);
		next();
	}
	//
	// // It is a valid email string and it is unique
	// async createEmailIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
	// 	switch(await this.lCreateEmailIsValid(req.body.email)) {
	// 		case  EMAIL_VALIDATION.VALID:
	// 			next();
	// 			break;
	// 		case EMAIL_VALIDATION.INVALID:
	// 			res.status(400).send({error: `Invalid user email: ` + req.body.email});
	// 			break;
	// 		case EMAIL_VALIDATION.ALREADY_EXISTS:
	// 			res.status(400).send({error: `New user email already exists: ` + req.body.email});
	// 			break;
	// 	}
	// }
	
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
			let missingAttributes = UserMiddleware.userUtil.lHasRequiredCreateAttributes(req.body)
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
			let errorMessage = UserMiddleware.userUtil.lHasOnlyRequiredCreateAttributes(req.body)
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
	
	// User patch request has valid attributes
	async hasValidPatchAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let nonPatchableAttributes = UserMiddleware.userUtil.lHasValidPatchAttributes(req.body)
			if (nonPatchableAttributes.length > 0) {
				// console.log('\n' + `User patch request has invalid attributes:  ${nonPatchableAttributes}` + '\n');
				res.status(400).send(`User patch request has invalid attributes:  ${nonPatchableAttributes}`);
			} else {
				// console.log('\n' + 'UserMiddleware/hasValidPatchAttributes/message: All create attributes are valid' + '\n');
				next()
			}
		}else {
			res.status(400).send(`User patch request does not include any attributes`);
		}
	}
	
	async hasOnlyValidPatchAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body) {
			let errorMessage = UserMiddleware.userUtil.lHasOnlyValidPatchAttributes(req.body);
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
			res.status(400).send({error: `Invalid user email: ` + req.body.email});
		} else {
			next();
		}
	}
	
	async emailIsUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.email && !UserMiddleware.userUtil.lEmailExists(req.body.email)) {
			next()
		} else {
			res.status(400).send(`User email already exists:  ${req.body.email}`);
		}
	}
	
	async passwordIsStrong(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.password && await utils.isPasswordStrong(req.body.password)) {
			next()
		} else {
			res.status(400).send(`User password is weak: ${req.body.password}`);
		}
	}
	
	async roleIsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.role) {
			let errorMessage = UserMiddleware.userUtil.lRatingIsValid(req.body.role);
			if (errorMessage.length === 0) {
				next()
			} else {
				res.status(400).send(errorMessage);
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
