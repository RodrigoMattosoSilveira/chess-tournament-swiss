import roundDao from './round.dao';
import {CRUD} from "../../common/crud.interface";
import {RoundDto} from "./round.model";

class RoundService implements CRUD {
	private static instance: RoundService;
	
	static getInstance(): RoundService {
		if (!RoundService.instance) {
			RoundService.instance = new RoundService();
		}
		return RoundService.instance;
	}
	
	async create(resource: RoundDto) {
		// console.log("RoundService/create: " + JSON.stringify(resource) +"\n");
		// console.log("RoundService/created id: " + id +"\n");
		return  await roundDao.add(resource);
	}
	
	async deleteById(resourceId: string) {
		return await roundDao.removeById(resourceId);
	};
	
	async list(/* limit: number, page: number */) { // limit and page are ignored until we upgrade our DAO
		return await roundDao.getAll();
	};
	
	async patchById(resource: RoundDto) {
		return await roundDao.patchById(resource)
	};
	
	async readById(resourceId: string) {
		// console.log("RoundService/readById: " + resourceId +"\n");
		return await roundDao.getById(resourceId);
	};
	
	async updateById(resource: RoundDto) {
		return await roundDao.putById(resource);
	};
}
export default RoundService.getInstance();
