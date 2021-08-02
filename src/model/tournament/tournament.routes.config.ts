/**
 * Define the Tournament requests API
 *
 * Here, we are importing the CommonRoutesConfig class and extending it to our new class, called TournamentRoutes. With
 * the constructor, we send the app (the main express.Application object) and the name TournamentRoutes to
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
import UserMiddleware from "../user/user.middleware";
import UserController from "../user/user.controller";

export class TournamentRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'TournamentRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our tournament endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /tournament/:id endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/tournament`) //this.app.route(`/tournament`)
			.get(TournamentController.getAll)
			.post(
				TournamentMiddleware.hasRequiredCreateAttributes,
				TournamentMiddleware.hasOnlyRequiredCreateAttributes,
				TournamentMiddleware.isNameUnique,
				TournamentMiddleware.isCityValid,
				TournamentMiddleware.isCountryValid,
				TournamentMiddleware.isRoundsValid,
				TournamentMiddleware.isMaxPlayersValid,
				TournamentMiddleware.isMinRateValid,
				TournamentMiddleware.isMaxRateValid,
				TournamentMiddleware.isTypeValid,
				TournamentMiddleware.isStateValid,
				TournamentMiddleware.isWinPointsValid,
				TournamentMiddleware.isTiePointsValid,
				TournamentMiddleware.isScheduledStartDateValid,
				TournamentMiddleware.isScheduledSEndDateValid,
				TournamentController.create);

		// This service does not support PUT / DELETE
		this.app.put(`/user/:userId`,[
			TournamentMiddleware.serviceDoesNotSupportPut,
		]);
		this.app.delete(`/user/:userId`,[
			TournamentMiddleware.serviceDoesNotSupportDelete,
		]);

		this.app.param(`userId`, UserMiddleware.extractUserId);
		this.app.route(`/user/:userId`)
			.all(TournamentMiddleware.entityExists)
			.get(TournamentController.getById);

		this.app.patch(`/user/:userId`, [
			TournamentMiddleware.hasRequiredCreateAttributes,
			TournamentMiddleware.hasOnlyRequiredCreateAttributes,
			TournamentMiddleware.isNameUnique,
			TournamentMiddleware.isCityValid,
			TournamentMiddleware.isCountryValid,
			TournamentMiddleware.isRoundsValid,
			TournamentMiddleware.isMaxPlayersValid,
			TournamentMiddleware.isMinRateValid,
			TournamentMiddleware.isMaxRateValid,
			TournamentMiddleware.isTypeValid,
			TournamentMiddleware.isStateValid,
			TournamentMiddleware.isWinPointsValid,
			TournamentMiddleware.isTiePointsValid,
			TournamentMiddleware.isScheduledStartDateValid,
			TournamentMiddleware.isScheduledSEndDateValid,
			TournamentMiddleware.isActualStartDateValid,
			TournamentMiddleware.isActualSEndDateValid,
			UserController.patch
		]);
		
		return this.app;
	}
}
