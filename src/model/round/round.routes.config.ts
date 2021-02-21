import express from 'express';

import {CommonRoutesConfig} from '../../common/common.routes.config';
import RoundController from './round.controller';
import RoundMiddleware from './round.middleware';

export class RoundRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'RoundRoutes');
	}
	
	/**
	 * This logic lets any REST API client call our round endpoint with a POST or a GET request. Similarly, it lets a
	 * client call our /round/:id endpoint with a GET, PUT, PATCH, or DELETE request.
	 */
	configureRoutes() {
		this.app.route(`/round`) //this.app.route(`/round`)
			.get(RoundController.getAll)
			.post(
				RoundMiddleware.validateRequiredBodyFields,
				RoundMiddleware.validateTournamentExist,
				RoundMiddleware.setRoundNumber,
				RoundController.create);
		
		this.app.param(`id`, RoundMiddleware.extractId);
		this.app.route(`/round/:id`)
			.all(RoundMiddleware.validateExists)
			.get(RoundController.getById)
			.delete(RoundController.delete); // This service does not support DELETE

		this.app.put(`/round/:id`,[
			// RoundMiddleware.validateExists,
			// RoundMiddleware.validateRequiredBodyFields,
			// RoundMiddleware.validateType,
			RoundController.put
		]);
		
		this.app.patch(`/round/:id`, [
			RoundMiddleware.validateExists,
			RoundMiddleware.validatePatchFields,
			RoundMiddleware.validateState,
			RoundController.patch
		]);
		
		return this.app;
	}
}
