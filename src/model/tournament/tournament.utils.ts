//TODO consider changing it from a singleton, to be a module that exports functions
import shortid from "shortid";
import {
	TOURNAMENT_LIMITS,
	TOURNAMENT_DEFAULTS
} from "./tournament.constants";
import {TOURNAMENT_PATCH_KEYS, TOURNAMENT_CREATE_KEYS, TOURNAMENT_DTO_KEYS} from "./tournament.interfaces";
import tournamentDao from "./tournament.dao";
import { ITournamentDto } from "./tournament.interfaces";
import {ITournamentMongoDoc} from "./tournament.mongo";
import {USER_DTO_KEYS, UserDto} from "../user/user.interfaces";

//TODO refactor all function names to remove their l prefix
export class TournamentUtil {
	private static instance: TournamentUtil;

	static getInstance() {
		if (!TournamentUtil.instance) {
			TournamentUtil.instance = new TournamentUtil();
		}
		return TournamentUtil.instance;
	}
	//****************************** Auxiliary methods for testing purposes *******************************************
	/**
	 * lAddAttributeDefaults Fills up default attributes
	 * @param resource
	 */
	lAddAttributeDefaults = (resource: ITournamentDto) => {
		resource.eid =  shortid.generate();	// created by the controller
		if (!resource.city) resource.city = TOURNAMENT_DEFAULTS.city;
		if (!resource.country) resource.country = TOURNAMENT_DEFAULTS.country;
		if (!resource.country) resource.year = TOURNAMENT_DEFAULTS.year;
		if (!resource.rounds) resource.rounds = TOURNAMENT_DEFAULTS.rounds;
		if (!resource.maxPlayers) resource.maxPlayers = TOURNAMENT_DEFAULTS.maxPlayers;
		if (!resource.minRate) resource.minRate = TOURNAMENT_DEFAULTS.minRate;
		if (!resource.maxRate) resource.maxRate = TOURNAMENT_DEFAULTS.maxRate;
		if (!resource.type) resource.type = TOURNAMENT_DEFAULTS.type;
		if (!resource.players) resource.players = [];
		if (!resource.state) resource.state = TOURNAMENT_DEFAULTS.state;
		if (!resource.winPoints) resource.winPoints = TOURNAMENT_DEFAULTS.winPoints;
		if (!resource.tiePoints) resource.tiePoints = TOURNAMENT_DEFAULTS.tiePoints;
		if (!resource.scheduledStartDate) resource.scheduledStartDate = TOURNAMENT_DEFAULTS.scheduledStartDate;
		if (!resource.scheduledEndDate) resource.scheduledEndDate = TOURNAMENT_DEFAULTS.scheduledEndDate;
		if (!resource.actualStartDate) resource.actualStartDate = TOURNAMENT_DEFAULTS.actualStartDate;
		if (!resource.actualEndDate) resource.actualEndDate = TOURNAMENT_DEFAULTS.actualEndDate;
	}

	/**
	 * lEmailExists Searches the database for an entity with the given email
	 * @param email, the email of the sought entity
	 * @returns boolean, true if an entity with this email exists, false otherwise
	 */
	async lTournamentNameExists (name: string): Promise<boolean> {
		//TODO Come back here after introducing the MONGO model
		// return await tournamentDao.tournamentNameExists(name);
		return true;
	}

	/**
	 * lEntityExists Searches the database for an entity with the given id
	 * @param id, the id of the sought entity
	 * @returns boolean, true if an entity with this id exists, false otherwise
	 */
	async lEntityExists (id: string): Promise<boolean> {
		//TODO Come back here after introducing the MONGO model
		// return await tournamentDao.idExists(id);
		return true;
	}

	fromMongoToDto(mongo: ITournamentMongoDoc): ITournamentDto  {
		let tournament: ITournamentDto = {eid: "", name: ""};
		TOURNAMENT_DTO_KEYS.forEach(el => {
			// @ts-ignore
			tournament[el] = mongo[el];
		})
		return tournament;
	}

}