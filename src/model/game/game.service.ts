import gameDao from './game.dao';
import {CRUD} from "../../common/crud.interface";
import {GameDto} from "./game.model";

class GameService implements CRUD {
	private static instance: GameService;
	
	static getInstance(): GameService {
		if (!GameService.instance) {
			GameService.instance = new GameService();
		}
		return GameService.instance;
	}
	
	async create(resource: GameDto) {
		// console.log("PlayerService/create: " + JSON.stringify(resource) +"\n");
		// console.log("PlayerService/created id: " + id +"\n");
		return  await gameDao.add(resource);
	}
	
	async deleteById(resourceId: string) {
		return await gameDao.removeById(resourceId);
	};
	
	async list(/* limit: number, page: number */) { // limit and page are ignored until we upgrade our DAO
		// console.log("\nGameService/list: \n");
		return await gameDao.getAll();
	};
	
	async patchById(resource: GameDto) {
		return await gameDao.patchById(resource)
	};
	
	async readById(resourceId: string) {
		return await gameDao.getById(resourceId);
	};
	
	async updateById(resource: GameDto) {
		return await gameDao.putById(resource);
	};
	
	async getByTournament(tournament: string) {
		return gameDao.getGamesByTournament(tournament);
		
	}
}
export default GameService.getInstance();
