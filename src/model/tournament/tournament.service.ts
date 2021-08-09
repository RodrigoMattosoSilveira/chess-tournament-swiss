import tournamentDao from './tournament.dao';
import {ITournamentPatch, ITournamentDto} from "./tournament.interfaces";
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
	
	async create(resource: ITournamentDto): Promise<DaoResult<ITournamentDto, ITournamentDto[]>> {
		// console.log("TournamentService/create: " + JSON.stringify(resource) +"\n");
		// console.log("TournamentService/created id: " + id +"\n");
		return  await tournamentDao.create(resource);
	}

	//TODO integrate limit and page
	async read(/* limit: number, page: number */): Promise<DaoResult<ITournamentDto, ITournamentDto[]>> { // limit and page are ignored until we upgrade our DAO
		return await tournamentDao.read();
	};
	
	async patch(resource: ITournamentPatch): Promise<DaoResult<ITournamentDto, ITournamentDto[]>> {
		console.log(`TournamentService/Patch: ${JSON.stringify(resource)}`);
		return await tournamentDao.patch(resource)
	};
	
	async readByEid(eid: string): Promise<DaoResult<ITournamentDto, ITournamentDto[]>> {
		return await tournamentDao.readByEid(eid);
	};

	//TODO Add logic to return a boolean, true if exists, false otherwise
	// async idExists(resourceId: string): Promise<boolean> {
	// 	let result = await tournamentDao.readById(resourceId);
	// 	return true;
	// };

	async readByName(name: string): Promise<DaoResult<ITournamentDto, ITournamentDto[]>>{
		return tournamentDao.readByName(name);
	}
}

export default TournamentService.getInstance();
