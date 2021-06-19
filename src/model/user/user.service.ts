import userDao from './user.dao';
import { CRUD } from "../../common/crud.interface";
import { UserDto } from "./user.model";
import { DaoResult } from "../../common/generic.interfaces";
import {UserDaoResult} from "./user.interfaces";

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

	async list(/*limit: number, page: number*/): Promise<DaoResult> { // limit and page are ignored until we upgrade our DAO
		return userDao.list();
	};

	async readById(resourceId: string): Promise<DaoResult> {
		return userDao.readById(resourceId);
	};

	async getByEmail(email: string): Promise<boolean> {
		return userDao.getByEmail(email);

	}

	async patchById(resource: UserDto): Promise<DaoResult> {
		return userDao.patchUserById(resource)
	};

	// Not supported
	// async deleteById(resourceId: string) {
	// 	return await userDao.deleteById(resourceId);
	// };

	// Not supported
	// async updateById(resource: UserDto) {
	// 	return await userDao.putUserById(resource);
	// };
}

export default UserService.getInstance();
