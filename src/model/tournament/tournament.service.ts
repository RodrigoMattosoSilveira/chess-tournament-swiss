import tournamentDao from './tournament.dao';
import {ITournamentPatch, TournamentDto} from "./tournament.interfaces";
import {DaoResult} from "../../common/generic.interfaces";

//TODO I remove the implements CRUD clause; replace it with generics
class TournamentService {
	private static instance: TournamentService;
	
	static getInstance(): TournamentService {
		if (!TournamentService.instance) {
			TournamentService.instance = new TournamentService();
		}
		return TournamentService.instance;
	}
	
	async create(resource: TournamentDto): Promise<DaoResult<TournamentDto, TournamentDto[]>> {
		// console.log("TournamentService/create: " + JSON.stringify(resource) +"\n");
		// console.log("TournamentService/created id: " + id +"\n");
		return  await tournamentDao.create(resource);
	}

	//TODO integrate limit and page
	async read(/* limit: number, page: number */): Promise<DaoResult<TournamentDto, TournamentDto[]>> { // limit and page are ignored until we upgrade our DAO
		return await tournamentDao.read();
	};
	
	async patch(resource: ITournamentPatch): Promise<DaoResult<TournamentDto, TournamentDto[]>> {
		return await tournamentDao.patch(resource)
	};
	
	async readById(resourceId: string): Promise<DaoResult<TournamentDto, TournamentDto[]>> {
		return await tournamentDao.readById(resourceId);
	};

	//TODO Add logic to return a boolean, true if exists, false otherwise
	// async idExists(resourceId: string): Promise<boolean> {
	// 	let result = await tournamentDao.readById(resourceId);
	// 	return true;
	// };

	async readByName(name: string): Promise<DaoResult<TournamentDto, TournamentDto[]>>{
		return tournamentDao.readByName(name);
	}
}

export default TournamentService.getInstance();
