import tournamentDao from './tournament.dao';
import {CRUD} from "../../common/crud.interface";
import {TournamentDto} from "./tournament.model";

class TournamentService implements CRUD {
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
		return  await tournamentDao.add(resource);
	}
	
	async deleteById(resourceId: string) {
		return await tournamentDao.removeById(resourceId);
	};
	
	async list(/* limit: number, page: number */) { // limit and page are ignored until we upgrade our DAO
		return await tournamentDao.getAll();
	};
	
	async patchById(resource: TournamentDto) {
		return await tournamentDao.patchById(resource)
	};
	
	async readById(resourceId: string) {
		return await tournamentDao.getById(resourceId);
	};
	
	async updateById(resource: TournamentDto) {
		return await tournamentDao.putById(resource);
	};
	
	async getByName(name: string) {
		return tournamentDao.getByName(name);
		
	}
	
}

export default TournamentService.getInstance();
