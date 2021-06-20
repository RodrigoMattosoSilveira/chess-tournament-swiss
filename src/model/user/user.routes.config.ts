/**
 * Define the User requests API
 *
 * Here, we are importing the CommonRoutesConfig class and extending it to our new class, called UserRoutes. With the
 * constructor, we send the app (the main express.Application object) and the name UserRoutes to CommonRoutesConfig’s
 * constructor.
 *
 * This example is quite simple, but when scaling to create several route files, this will help us avoid duplicate code.
 *
 * Suppose we would want to add new features in this file, such as logging. We could add the necessary field to the
 * CommonRoutesConfig class, and then all the routes that extend CommonRoutesConfig will have access to it.
 */

import {CommonRoutesConfig} from '../../common/common.routes.config';
import UserController from './user.controller';
import UserMiddleware from './user.middleware';
import express from 'express';

export class UserRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'UserRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our user endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /user/:userId endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/user`)
			.get(UserController.list)
			.post(
				UserMiddleware.hasRequiredCreateAttributes,
				UserMiddleware.hasOnlyRequiredCreateAttributes,
				UserMiddleware.emailIsValid,
				UserMiddleware.emailIsUnique,
				UserMiddleware.passwordIsStrong,
				UserController.create);

		// This service does not support PUT / DELETE
		this.app.put(`/user/:userId`,[
			UserMiddleware.serviceDoesNotSupportPut,
		]);
		this.app.delete(`/user/:userId`,[
			UserMiddleware.serviceDoesNotSupportDelete,
		]);
		
		this.app.param(`userId`, UserMiddleware.extractUserId);
		this.app.route(`/user/:userId`)
			.all(UserMiddleware.entityExists)
			.get(UserController.getById);
		
		this.app.patch(`/user/:userId`, [
			UserMiddleware.hasValidPatchAttributes,
			UserMiddleware.hasOnlyValidPatchAttributes,
			UserMiddleware.emailIsValid,
			UserMiddleware.emailIsUnique,
			UserMiddleware.passwordIsStrong,
			UserMiddleware.roleIsValid,
			UserMiddleware.ratingIsNumeric,
			UserMiddleware.ratingIsValid,
			UserMiddleware.ratingStateIsValid,
			UserMiddleware.stateIsValid,
			UserController.patch
		]);
		
		return this.app;
	}
}
