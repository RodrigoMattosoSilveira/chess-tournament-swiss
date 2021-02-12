/**
 * Define the Tournament requests API
 *
 * Here, we are importing the CommonRoutesConfig class and extending it to our new class, called TournamentRoutes. With
 * the constructor, we send the app (the main express.Application object) and the name UserRoutes to
 * CommonRoutesConfig’s constructor.
 *
 * This example is quite simple, but when scaling to create several route files, this will help us avoid duplicate code.
 *
 * Suppose we would want to add new features in this file, such as logging. We could add the necessary field to the
 * CommonRoutesConfig class, and then all the routes that extend CommonRoutesConfig will have access to it.
 */

import {CommonRoutesConfig} from '../../common/common.routes.config';
import PlayerController from './player.controller';
import PlayerMiddleware from './player.middleware';
import express from 'express';

export class PlayerRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'TournamentRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our user endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /user/:userId endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/player`) //this.app.route(`/player`)
			.get(PlayerController.getAll)
			.post(
				PlayerMiddleware.validateRequiredBodyFields,
				PlayerMiddleware.validateUser,
				PlayerMiddleware.validateTournament,
				PlayerController.create);
		
		this.app.param(`id`, PlayerMiddleware.extractId);
		this.app.route(`/player/:id`)
			.all(PlayerMiddleware.validateExists)
			.get(PlayerController.getById)
			.delete(PlayerController.delete); // this service does not support delete
		
		// This service does not support put
		this.app.put(`/player/:id`,[
			// PlayerMiddleware.validateExists,
			// PlayerMiddleware.validateRequiredBodyFields,
			// PlayerMiddleware.validateType,
			PlayerController.put  // this service does not support delete
		]);
		
		this.app.patch(`/player/:id`, [
			PlayerMiddleware.validateExists,
			PlayerMiddleware.validateState,
			PlayerController.patch
		]);
		
		return this.app;
	}
}
