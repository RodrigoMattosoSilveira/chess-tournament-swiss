import userDao from './user.dao';
import { CRUD } from "../../common/crud.interface";
import { UserDto } from "./user.interfaces";
import { UserDaoResult } from "./user.interfaces";
import {UserUtil} from "./user.util";

class UserService implements CRUD {
	private static instance: UserService;
	private userUtil:UserUtil = UserUtil.getInstance();
	
	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}
	
	async create(resource: UserDto): Promise<UserDaoResult> {
		this.userUtil.lAddAttributeDefaults(resource);
		return await userDao.create(resource);
	}

	async list(/*limit: number, page: number*/): Promise<UserDaoResult> { // limit and page are ignored until we upgrade our DAO
		return await userDao.list();
	};

	async readById(resourceId: string): Promise<UserDaoResult> {
		return await userDao.readById(resourceId);
	};

	async getByEmail(email: string): Promise<UserDaoResult> {
		return await userDao.getByEmail(email);
	}

	async patchById(resource: UserDto): Promise<UserDaoResult> {
		return await userDao.patchUserById(resource)
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
