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


export class TournamentRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'TournamentRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our tournament endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /tournament/:eid endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/tournament`) //this.app.route(`/tournament`)
			.get(TournamentController.read)
			.post(
				TournamentMiddleware.hasRequiredCreateAttributes,
				TournamentMiddleware.hasOnlyRequiredCreateAttributes,
				TournamentMiddleware.isNameUnique,
				TournamentController.create);

		// This service does not support PUT / DELETE
		this.app.put(`/tournament/:eid`,[
			TournamentMiddleware.serviceDoesNotSupportPut,
		]);
		this.app.delete(`/tournament/:eid`,[
			TournamentMiddleware.serviceDoesNotSupportDelete,
		]);

		this.app.param(`eid`, TournamentMiddleware.extractEid);
		this.app.route(`/tournament/:eid`)
			.all(TournamentMiddleware.eidExists)
			.get(TournamentController.readByEid);

		this.app.patch(`/tournament/:eid`, [
			TournamentMiddleware.hasOnlyValidPatchAttributes,
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
			TournamentMiddleware.isTieWinIntervalValid,
			TournamentMiddleware.isScheduledStartDateValid,
			TournamentMiddleware.isScheduledSEndDateValid,
			TournamentMiddleware.isScheduledDateIntervalValid,
			TournamentMiddleware.isActualStartDateValid,
			TournamentMiddleware.isActualEndDateValid,
			TournamentMiddleware.isActualDateIntervalValid,
			TournamentController.patch
		]);
		
		return this.app;
	}
}
