import userDao from './tournament.dao';
import {CRUD} from "../../common/crud.interface";
import {TournamentDto} from "./tournament.model";

class UserService implements CRUD {
	private static instance: UserService;
	
	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}
	
	async create(resource: TournamentDto) {
		return await userDao.add(resource);
	}
	
	async deleteById(resourceId: string) {
		return await userDao.removeById(resourceId);
	};
	
	async list(limit: number, page: number) { // limit and page are ignored until we upgrade our DAO
		return await userDao.getAll();
	};
	
	async patchById(resource: TournamentDto) {
		return await userDao.patchById(resource)
	};
	
	async readById(resourceId: string) {
		return await userDao.getById(resourceId);
	};
	
	async updateById(resource: TournamentDto) {
		return await userDao.putById(resource);
	};
	
	async getByName(name: string) {
		return userDao.getByName(name);
		
	}
	
}

export default UserService.getInstance();
