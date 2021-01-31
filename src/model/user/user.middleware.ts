import express from 'express';

// todo: change it to service
import userService from './user.service';

class UserMiddleware {
	private static instance: UserMiddleware;
	
	static getInstance() {
		if (!UserMiddleware.instance) {
			UserMiddleware.instance = new UserMiddleware();
		}
		return UserMiddleware.instance;
	}
	
	async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body && req.body.email && req.body.password) {
			next();
		} else {
			res.status(400).send({error: `Missing required fields: email and/or password`});
		}
	}
	
	async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
		const user = await userService.getUserByEmail(req.body.email);
		if (user) {
			res.status(400).send({error: `User email already exists`});
		} else {
			next();
		}
	}
	
	async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction) {
		const user = await userService.getUserByEmail(req.body.email);
		if (user && user.id === req.params.userId) {
			next();
		} else {
			res.status(400).send({error: `Invalid email`});
		}
	}
	
	async validatePatchEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.body.email) {
			await UserMiddleware.getInstance().validateSameEmailBelongToSameUser(req, res, next);
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
	
	async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
		req.body.id = req.params.userId;
		next();
	}
}

export default UserMiddleware.getInstance();
