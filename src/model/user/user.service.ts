import userDao from './user.dao';
import {CRUD} from "../../common/crud.interface";
import {UserDto} from "./user.model";

class UserService implements CRUD {
	private static instance: UserService;
	
	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}
	
	async create(resource: UserDto) {
		return await userDao.addUser(resource);
	}
	
	async deleteById(resourceId: string) {
		return await userDao.removeUserById(resourceId);
	};
	
	async list(limit: number, page: number) { // limit and page are ignored until we upgrade our DAO
		return await userDao.getUsers();
	};
	
	async patchById(resource: UserDto) {
		return await userDao.patchUserById(resource)
	};
	
	async readById(resourceId: string) {
		return await userDao.getUserById(resourceId);
	};
	
	async updateById(resource: UserDto) {
		return await userDao.putUserById(resource);
	};
	
	async getUserByEmail(email: string) {
		return userDao.getUserByEmail(email);
		
	}
}

export default UserService.getInstance();
