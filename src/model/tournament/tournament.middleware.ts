import express from 'express';

// todo: apply this generalization to all other entities
import service from './tournament.service';
import tournamentService from "../tournament/tournament.service";
import {tournament_types, tournament_states, TOURNAMENT_REQUIRED_ATTRIBUTES} from "../../contants/contants";
import * as utils from "../../utils/utils";
import {TOURNAMENT_CREATE_KEYS} from "./tournament.interfaces";
import {TOURNAMENT_STATE, TOURNAMENT_TYPE} from "./tournament.constants";
import {COUNTRIES} from "../../seed-data/countries";

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

	async isNameUnique(req: express.Request, res: express.Response, next: express.NextFunction) {
		const tournament = await tournamentService.getByName(req.body.name);
		if (tournament) {
			// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique/message: Name already exists' + '\n');
			res.status(400).send({error: `Tournament name already exists: ` + req.body.name});
		} else {
			// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique/message: Name is unique' + '\n');
			next();
		}
	}

	async isCityValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.city) {
			next();
		} else {
			let subject = req.body.city
			let subjectText = "city"
			if (false == await utils.isCityValid(subject)) {
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
			if (subject in COUNTRIES) {
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
			if (false == await utils.isStringNumeric("" +subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: subject}`)
				res.status(400).send(`Tournament  ${subjectText} is not valid: ${subject}`);
			} else {
				if (req.body.rounds < 25) {
					next();
				}
				else {
					console.log(`TournamentMiddleware -  ${subjectText} is greater than 24: ${subject}`)
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
			if (false == await utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				let maxPlayersLimit = 1025;
				if (subject < maxPlayersLimit) {
					next();
				}
				else {
					console.log(`TournamentMiddleware - ${subjectText} is greater than ${maxPlayersLimit}: ${subject}`)
					res.status(400).send(`Tournament ${subjectText} is greater than ${maxPlayersLimit}: ${subject}`);
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
			let subject = req.body.type;
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


	async isMinRateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.minRate) {
			next();
		} else {
			let subject = req.body.minRate;
			let subjectText = "minRate"
			if (false == await utils.isStringNumeric("" + subject)) {
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
			if (false == await utils.isStringNumeric("" + subject)) {
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

	// TODO add validation for when minRate and maxRate are supplied
	// TODO add validation for when minRate or maxRate are supplied, and patching, to ensure they are compatible with the existing rates

	async isWinPointsValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.winPoints) {
			next();
		} else {
			let subject = req.body.winPoints;
			let subjectText = "winPoints"
			if (false == await utils.isStringNumeric("" + subject)) {
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
			if (false == await utils.isStringNumeric("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not numeric: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not numeric: ${subject}`);
			} else {
				next();
			}
		}
	}

	// TODO add validation for when winPoints and tiePoints are supplied, winPoints is higher than tiePoints
	// TODO add validation for when winPoints or tiePoints are supplied, and patching, to ensure they are compatible with the existing values

	async isScheduledStartDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.scheduledStartDate) {
			next();
		} else {
			let subject = req.body.scheduledStartDate
			let subjectText = "scheduledStartDate"
			if (false == await utils.isValidDate("" + subject)) {
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
			if (false == await utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	// TODO add validation for when scheduledStartDate and scheduledEndDate are supplied, scheduledStartDate is less than scheduledEndDate
	// TODO add validation for when scheduledStartDate or scheduledEndDate are supplied, and patching, to ensure they are compatible with the existing values

	async isActualStartDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.scheduledStartDate) {
			next();
		} else {
			let subject = req.body.actualStartDate
			let subjectText = "actualStartDate"
			if (false == await utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	async isActualSEndDateValid(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!req.body.actualEndDate) {
			next();
		} else {
			let subject = req.body.actualEndDate
			let subjectText = "actualEndDate"
			if (false == await utils.isValidDate("" + subject)) {
				console.log(`TournamentMiddleware - ${subjectText} is not valid: ${subject}`)
				res.status(400).send(`Tournament ${subjectText} is not valid: ${subject}`);
			} else {
				next();
			}
		}
	}

	// TODO add validation for when actualStartDate and actualEndDate are supplied, actualStartDate is less than actualEndDate
	// TODO add validation for when actualStartDate or actualEndDate are supplied, and patching, to ensure they are compatible with the existing values
	
	async entityExists(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/validateNameIsUnique : User exists' + '\n');
		let subject = req.params.id
		let subjectText = "Entity"
		const entity = await service.readById(subject);
		if (entity) {
			next();
		} else {
			res.status(400).send({error: `Tournament ${subjectText} not found: ${subject}`});
		}
	}

	async serviceDoesNotSupportPut(req: express.Request, res: express.Response) {
		res.status(404).send(`This service does not support PUT`);
	}

	async serviceDoesNotSupportDelete(req: express.Request, res: express.Response) {
		res.status(404).send(`This service does not support DELETE`);
	}

	async extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
		// console.log('\n' + 'TournamentMiddleware/extractId/id: ' + req.params.id + '\n');
		req.body.id = req.params.id;
		next();
	}
}

export default TournamentMiddleware.getInstance();
