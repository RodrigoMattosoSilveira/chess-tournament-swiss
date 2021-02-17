/**
 * Define the Game requests API
 *
 * Here, we are importing the CommonRoutesConfig class and extending it to our new class, called GameRoutes. With the
 * constructor, we send the app (the main express.Application object) and the name GameRoutes to CommonRoutesConfig’s
 * constructor.
 *
 * This example is quite simple, but when scaling to create several route files, this will help us avoid duplicate code.
 *
 * Suppose we would want to add new features in this file, such as logging. We could add the necessary field to the
 * CommonRoutesConfig class, and then all the routes that extend CommonRoutesConfig will have access to it.
 */
import express from 'express';

import {CommonRoutesConfig} from '../../common/common.routes.config';
import GameController from './game.controller';
import GameMiddleware from './game.middleware';

export class GameRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'GameRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our game endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /game/:id endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/game`)
			.get(GameController.getAll)
			.post(
				GameMiddleware.validateRequiredBodyFields,
				GameMiddleware.validateTournament,
				GameMiddleware.validateWhitePiecesPlayer,
				GameMiddleware.validateBlackPiecesPlayer,
				GameMiddleware.validateState,
				GameMiddleware.validateDate,
				GameController.create);
		
		this.app.param(`id`, GameMiddleware.extractId);
		this.app.route(`/game/:id`)
			.all(GameMiddleware.validateExists)
			.get(GameController.getById)
			.delete(GameController.delete); // This service does not support DELETE
		
		// This service does not support PUT
		this.app.put(`/game/:id`,[
			// GameMiddleware.validateRequiredUserBodyFields,
			// GameMiddleware.validateSameEmailBelongToSameUser,
			GameController.put // This service does not support PUT
		]);
		
		this.app.patch(`/game/:id`, [
			GameMiddleware.validatePatchableAttributes,
			GameMiddleware.validateState,
			GameMiddleware.validateResult,
			GameMiddleware.validateDate,
			GameController.patch
		]);
		
		return this.app;
	}
}
