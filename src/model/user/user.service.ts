import userDao from './user.dao';
import { CRUD } from "../../common/crud.interface";
import { UserDto } from "./user.interfaces";
import { DaoResult } from "../../common/generic.interfaces";

class UserService implements CRUD {
	private static instance: UserService;
	
	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}
	
	async create(resource: UserDto): Promise<DaoResult<UserDto, UserDto[]>> {
		return await userDao.create(resource);
	}

	async readById(resourceId: string): Promise<DaoResult<UserDto, UserDto[]>> {
		return await userDao.readById(resourceId);
	};

	async list(/*limit: number, page: number*/): Promise<DaoResult<UserDto, UserDto[]>> { // limit and page are ignored until we upgrade our DAO
		return await userDao.list();
	};

	async patchById(resource: UserDto): Promise<DaoResult<UserDto, UserDto[]>> {
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
