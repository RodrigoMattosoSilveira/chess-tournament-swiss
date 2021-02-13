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
import TournamentController from './tournament.controller';
import TournamentMiddleware from './tournament.middleware';
import express from 'express';

export class TournamentRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'TournamentRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our user endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /user/:userId endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/tournament`) //this.app.route(`/tournament`)
			.get(TournamentController.getAll)
			.post(
				TournamentMiddleware.validateRequiredBodyFields,
				TournamentMiddleware.validateNameIsUnique,
				TournamentMiddleware.validateType,
				TournamentMiddleware.validateState,
				TournamentMiddleware.validateWinPoints,
				// TournamentMiddleware.validateTie,
				TournamentController.create);
		
		this.app.param(`id`, TournamentMiddleware.extractId);
		this.app.route(`/tournament/:id`)
			.all(TournamentMiddleware.validateExists)
			.get(TournamentController.getById)
			.delete(TournamentController.delete); // this service does not support delete
		
		// This service does not support put
		this.app.put(`/tournament/:id`,[
			// TournamentMiddleware.validateExists,
			// TournamentMiddleware.validateRequiredBodyFields,
			// TournamentMiddleware.validateType,
			TournamentController.put
		]);
		
		this.app.patch(`/tournament/:id`, [
			TournamentMiddleware.validateExists,
			TournamentMiddleware.validateType,
			TournamentMiddleware.validateState,
			TournamentMiddleware.validateWinPoints,
			TournamentMiddleware.validateTiePoints,
			TournamentController.patch
		]);
		
		return this.app;
	}
}
