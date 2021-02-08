import playerDao from './player.dao';
import {CRUD} from "../../common/crud.interface";
import {PlayerDto} from "./player.model";

class PlayerService implements CRUD {
	private static instance: PlayerService;
	
	static getInstance(): PlayerService {
		if (!PlayerService.instance) {
			PlayerService.instance = new PlayerService();
		}
		return PlayerService.instance;
	}
	
	async create(resource: PlayerDto) {
		// console.log("PlayerService/create: " + JSON.stringify(resource) +"\n");
		// console.log("PlayerService/created id: " + id +"\n");
		return  await playerDao.add(resource);
	}
	
	async deleteById(resourceId: string) {
		return await playerDao.removeById(resourceId);
	};
	
	async list(/* limit: number, page: number */) { // limit and page are ignored until we upgrade our DAO
		return await playerDao.getAll();
	};
	
	async patchById(resource: PlayerDto) {
		return await playerDao.patchById(resource)
	};
	
	async readById(resourceId: string) {
		return await playerDao.getById(resourceId);
	};
	
	async updateById(resource: PlayerDto) {
		return await playerDao.putById(resource);
	};
	
	async getByName(tournament: string) {
		return playerDao.getPlayersByTournament(tournament);
		
	}
}

export default PlayerService.getInstance();
