import express from 'express';

// todo: apply this generalization to all other entities
import tournamentController from "../tournament/tournament.controller";
import * as utils from "../../utils/utils";
import {TOURNAMENT_CREATE_KEYS, TOURNAMENT_PATCH_KEYS} from "./tournament.interfaces";
import {TOURNAMENT_STATE, TOURNAMENT_TYPE, TOURNAMENT_LIMITS} from "./tournament.constants";
import {hasOnlyRequiredKeys, isCountryValid} from "../../utils/utils";

class TournamentMiddleware {
	private static instance: TournamentMiddleware;
	
	static getInstance() {
		if (!TournamentMiddleware.instance) {
			TournamentMiddleware.instance = new TournamentMiddleware();
		}
		return TournamentMiddleware.instance;
	}
	
	async hasRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		let missingAttributes: string = "";
		if (req.body) {
			missingAttributes = utils.hasRequiredKeys(req.body,  TOURNAMENT_CREATE_KEYS);
			if (missingAttributes.length > 0) {
				// console.log('\n' + 'TournamentMiddleware/hasRequiredCreateAttributes/message: ' + missingAttributes + '\n');
				res.status(400).send(`Tournament create request missing required attributes: ${missingAttributes}`);
			} else {
				// console.log('\n' + 'Tournament/hasRequiredCreateAttributes/message: All required attributes present' + '\n');
				next()
			}
		}else {
			console.log(`TournamentMiddleware - hasRequiredCreateAttributes failed: ${missingAttributes}`)
			res.status(400).send(`Tournament create request does not include any attributes`);
		}
	}

	// User create request has only required attributes
	async hasOnlyRequiredCreateAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		let errorMessage: string = ""
		if (req.body) {
			errorMessage = utils.hasOnlyRequiredKeys(req.body, TOURNAMENT_CREATE_KEYS);
			if (errorMessage.length > 0) {
				// console.log('\n' + 'UserMiddleware/hasOnlyRequiredCreateAttributes/message: ' + errorMessage + '\n');
				res.status(400).send(`Tournament create request has invalid attributes: ${errorMessage}`);
			} else {
				// console.log('\n' + 'TournamentMiddleware/hasOnlyRequiredCreateAttributes/message: All required attributes present' + '\n');
				next()
			}
		}else {
			console.log(`TournamentMiddleware - hasOnlyRequiredCreateAttributes failed: ${errorMessage}`)
			res.status(400).send(`User create request does not include any attributes`);
		}
	}

	async hasOnlyValidPatchAttributes(req: express.Request, res: express.Response, next: express.NextFunction) {
		let errorMessage: string = "";
		if (req.body) {
			errorMessage = hasOnlyRequiredKeys(req.body, TOURNAMENT_PATCH_KEYS);
			if (errorMessage.length > 0) {
				// console.log('\n' + 'TournamentMiddleware/hasOnlyValidPatchAttributes/message: ' + errorMessage + '\n');
				res.status(400).send(`TournamentMiddleware/hasOnlyValidPatchAttribute patch request has invalid attributes:  ${errorMessage}`);
			} else {
				// console.log('\n' + TournamentMiddleware/hasOnlyValidPatchAttribute patch: All patch attributes are valid' + '\n');
				next()
			}
		}else {
			console.log(`TournamentMiddleware/hasOnlyValidPatchAttribute failed: ${errorMessage}`)
			res.status(400).send(`TournamentMiddleware/hasOnlyValidPatchAttribute failed: ${errorMessage}\``);
		}
	}

	async isNameUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.name) {
			next()
		}
		else {
			const nameExists: boolean = await tournamentController.nameExists(req.body.name);
			if (nameExists) {
				// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique/message: Name already exists' + '\n');
				res.status(400).send({error: `Tournament name already exists: ${req.body.name}`});
			} else {
				// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique/message: Name is unique' + '\n');
				next();
			}
		}
	}

	async isCityValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.city) {
			next();
		} else {
			let subject = req.body.city
			let subjectText = "city"
			if (!utils.isCityValid(subject)) {
				console.log(`TournamentMiddleware -  ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isCountryValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.country) {
			next();
		} else {
			let subject = req.body.country;
			let subjectText = "COUNTRY"
			if (isCountryValid(subject)) {
				next();
			}
			else {
				console.log(`TournamentMiddleware - ${subjectText} is not in  ${subject}`)
				res.status(400).send(`Tournament  ${subjectText} is not in  ${subject}`);
			}
		}
	}

	async isRoundsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.rounds) {
			next();
		} else {
			let subject = req.body.rounds
			let subjectText = "rounds"
			if (!utils.isStringNumeric("" +subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: subject}`)
				res.status(400).send(`Tournament  ${subjectText} is not valid: ${subject}`);
			} else {
				if (req.body.rounds <= TOURNAMENT_LIMITS.rounds) {
					next();
				}
				else {
					console.log(`TournamentMiddleware -  ${subjectText} is greater than ${TOURNAMENT_LIMITS.rounds}: ${subject}`)
					res.status(400).send(`Tournament  ${subjectText} is greater than 24: ${subject}`);
				}
			}
		}
	}

	async isMaxPlayersValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.maxPlayers) {
			next();
		} else {
			let subject = req.body.maxPlayers
			let subjectText = "maxPlayers"
			if (!utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				if (subject <  TOURNAMENT_LIMITS.maxPlayers) {
					next();
				}
				else {
					console.log(`TournamentMiddleware - ${subjectText} is greater than ${ TOURNAMENT_LIMITS.maxPlayers}: ${subject}`)
					res.status(400).send(`Tournament ${subjectText} is greater than ${ TOURNAMENT_LIMITS.maxPlayers}: ${subject}`);
				}
			}
		}
	}

	async isTypeValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.type) {
			next();
		} else {
			let subject = req.body.type;
			let subjectText = "TOURNAMENT_TYPE"
			if (subject in TOURNAMENT_TYPE) {
				next();
			}
			else {
				console.log(`TournamentMiddleware - ${subjectText} is not a valid  ${subject}`)
				res.status(400).send(`Tournament  ${subjectText} is not valid: ${subject}`);
			}
		}
	}

	async isStateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.state) {
			next();
		} else {
			let subject = req.body.state;
			let subjectText = "TOURNAMENT_STATE"
			if (subject in TOURNAMENT_STATE) {
				next();
			}
			else {
				console.log(`TournamentMiddleware - ${subjectText} is not a valid  ${subject}`)
				res.status(400).send(`Tournament  ${subjectText} is not valid: ${subject}`);
			}
		}
	}

	// TODO: 0 <= minRate < maxRate; minRate < maxRate <= Number.MaxInt
	// When minRate = 0, there is no minumum rate;
	// When maxRate = Number.MaxInt, there is no maximum rate
	async isMinRateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.minRate) {
			next();
		} else {
			let subject = req.body.minRate;
			let subjectText = "minRate"
			if (!utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not numeric: ${subject}`);
			} else {
				if (subject > -1) {
					next();
				}
				else {
					console.log(`TournamentMiddleware - ${subjectText} is less than 0: ${subject}`)
					res.status(400).send(`Tournament ${subjectText} is less than 0: ${subject}`);
				}
			}
		}
	}

	async isMaxRateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.maxRate) {
			next();
		} else {
			let subject = req.body.maxRate;
			let subjectText = "maxRate"
			if (!utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not numeric: ${subject}`);
			} else {
				if (subject > -1) {
					next();
				}
				else {
					console.log(`TournamentMiddleware - ${subjectText} is less than 0: ${subject}`)
					res.status(400).send(`Tournament ${subjectText} is less than 0: ${subject}`);
				}
			}
		}
	}

	// TODO add tie points must be lower than winPoints
	async isWinPointsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.winPoints) {
			next();
		} else {
			let subject = req.body.winPoints;
			let subjectText = "winPoints"
			if (!utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isTiePointsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.tiePoints) {
			next();
		} else {
			let subject = req.body.tiePoints;
			let subjectText = "tiePoints"
			if (!utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not numeric: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isTieWinIntervalValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!(req.body.tiePoints && req.body.winPoints)) {
			next();
		} else {
			let subjectLeft = req.body.tiePoints;
			let subjectRight = req.body.winPoints;
			let subjectText = "tiePoints winPoints interval"
			if (!utils.isNumericIntervalValid(subjectLeft, subjectRight, false)) {
				let errorMsg = `TournamentMiddleware - ${subjectText} is not valid: ${subjectLeft}, ${subjectRight}`
				console.log(errorMsg)
				res.status(400).send(errorMsg);
			} else {
				next();
			}
		}

	}

	// Dates are stores as EPOCH time, start date must be lower or equal to end date
	async isScheduledStartDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.scheduledStartDate) {
			next();
		} else {
			let subject = req.body.scheduledStartDate
			let subjectText = "scheduledStartDate"
			if (!utils.isStringNumeric("" + subject)) {
			// if (!utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isScheduledSEndDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.scheduledEndDate) {
			next();
		} else {
			let subject = req.body.scheduledEndDate
			let subjectText = "scheduledEndDate"
			if (!utils.isStringNumeric("" + subject)) {
				// if (!utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isScheduledDateIntervalValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!(req.body.scheduledStartDate && req.body.scheduledEndDate)) {
			next();
		} else {
			let subjectLeft = req.body.scheduledStartDate;
			let subjectRight = req.body.scheduledEndDate;
			let subjectText = "scheduled Date interval"
			if (!utils.isNumericIntervalValid(subjectLeft, subjectRight, true)) {
				let errorMsg = `TournamentMiddleware - ${subjectText} is not valid: ${subjectLeft}, ${subjectRight}`
				console.log(errorMsg)
				res.status(400).send(errorMsg);
			} else {
				next();
			}
		}

	}

	// Dates are stores as EPOCH time, start date must be lower or equal to end date
	async isActualStartDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.actualStartDate) {
			next();
		} else {
			let subject = req.body.actualStartDate
			let subjectText = "actualStartDate"
			if (!utils.isStringNumeric("" + subject)) {
				// if (!utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isActualEndDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.actualEndDate) {
			next();
		} else {
			let subject = req.body.actualEndDate
			let subjectText = "actualEndDate"
			if (!utils.isStringNumeric("" + subject)) {
				// if (!utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isActualDateIntervalValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!(req.body.actualStartDate && req.body.actualEndDate)) {
			next();
		} else {
			let subjectLeft = req.body.actualStartDate;
			let subjectRight = req.body.actualEndDate;
			let subjectText = "actual Date interval"
			if (!utils.isNumericIntervalValid(subjectLeft, subjectRight, true)) {
				let errorMsg = `TournamentMiddleware - ${subjectText} is not valid: ${subjectLeft}, ${subjectRight}`
				console.log(errorMsg)
				res.status(400).send(errorMsg);
			} else {
				next();
			}
		}
	}

	async extractEid(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/extractId/id: ' + req.params.eid + '\n');
		req.body.eid = req.params.eid;
		next();
	}

	async eidExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (await tournamentController.eidExists(req.body.eid)) {
			next()
		} else {
			console.log(`TournamentMiddleware - entityExists failed: ${req.body.eid}`)
			res.status(400).send(`TournamentMiddleware.eidExists: eid not found: ${req.body.eid}`);
		}
	}

	async serviceDoesNotSupportPut(req: express.Request, res: express.Response) {
		res.status(404).send(`This service does not support PUT`);
	}

	async serviceDoesNotSupportDelete(req: express.Request, res: express.Response) {
		res.status(404).send(`This service does not support DELETE`);
	}
}

export default TournamentMiddleware.getInstance();
