import express from 'express';

// todo: change it to service
import userService from './user.service';
import {user_states} from "../../contants/contants";

class UserMiddlewareOld {
	private static instance: UserMiddlewareOld;
	
	static getInstance() {
		if (!UserMiddlewareOld.instance) {
			UserMiddlewareOld.instance = new UserMiddlewareOld();
		}
		return UserMiddlewareOld.instance;
	}
	
	async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body && req.body.email && req.body.password) {
			next();
		} else {
			res.status(400).send({error: `Missing required fields: email and/or password`});
		}
	}
	
	async validateEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'UserMiddleware/validateEmail/email: ' + req.body.email + '\n');
		// https://emailregex.com/
		const regexp = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
		if (req.body.email && !regexp.test(req.body.email)) {
			res.status(400).send({error: `Invalid user email: ` + req.body.email});
		} else {
			next();
		}
	}
	
	async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
		const user = await userService.getUserByEmail(req.body.email);
		if (user) {
			res.status(400).send({error: `New user email already exists`});
		} else {
			next();
		}
	}
	
	async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		const user = await userService.readById(req.params.userId);
		if (user) {
			next();
		} else {
			res.status(404).send({error: `User ${req.params.userId} not found`});
		}
	}
	
	async validateState(req: express.Request, res: express.Response, next: express.NextFunction) {
		// Validate state only if present
		if (!req.body.state) {
			next()
		} else {
			// console.log('\n' + 'UserMiddleware/validateState/value: ' + req.body.state + '\n');
			// it is present, hence must be valid
			if (!isStateSupported(req.body.state)) {
				res.status(404).send({error: `state ${req.body.state} is invalid`});
			}
			next();
		}
	}
	
	async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
		req.body.id = req.params.userId;
		next();
	}
}
export default UserMiddlewareOld.getInstance();


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
