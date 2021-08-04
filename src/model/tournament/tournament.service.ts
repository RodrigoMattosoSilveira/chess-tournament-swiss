import tournamentDao from './tournament.dao';
import {CRUD} from "../../common/crud.interface";
import {TournamentDto} from "./tournament.interfaces";

//TODO I remove the implements CRUD clause; replace it with generics
class TournamentService {
	private static instance: TournamentService;
	
	static getInstance(): TournamentService {
		if (!TournamentService.instance) {
			TournamentService.instance = new TournamentService();
		}
		return TournamentService.instance;
	}
	
	async create(resource: TournamentDto) {
		// console.log("TournamentService/create: " + JSON.stringify(resource) +"\n");
		// console.log("TournamentService/created id: " + id +"\n");
		return  await tournamentDao.create(resource);
	}

	//TODO integrate limit and page
	async read(/* limit: number, page: number */) { // limit and page are ignored until we upgrade our DAO
		return await tournamentDao.read();
	};
	
	async patch(resource: TournamentDto) {
		return await tournamentDao.patch(resource)
	};
	
	async readById(resourceId: string) {
		return await tournamentDao.readById(resourceId);
	};

	//TODO Add logic to return a boolean, true if exists, false otherwise
	async idExists(resourceId: string): Promise<boolean> {
		let result = await tournamentDao.readById(resourceId);
		return true;
	};

	async readByName(name: string) {
		return tournamentDao.readByName(name);
	}

	//TODO Add logic to return a boolean, true if exists, false otherwise
	async nameExists(name: string): Promise<boolean> {
		let result = await tournamentDao.readByName(name);
		return true;
	}

}

export default TournamentService.getInstance();
