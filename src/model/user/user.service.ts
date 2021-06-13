import userDao from './user.dao';
import { CRUD } from "../../common/crud.interface";
import {UserDaoResult, UserDto} from "./user.model";
import { Result, Ok, Err } from 'space-monad';

class UserService implements CRUD {
	private static instance: UserService;
	
	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}
	
	async create(resource: UserDto): Promise<UserDaoResult> {
		return userDao.create(resource);
	}
	
	async deleteById(resourceId: string) {
		return await userDao.removeUserById(resourceId);
	};
	
	async list(/*limit: number, page: number*/) { // limit and page are ignored until we upgrade our DAO
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
