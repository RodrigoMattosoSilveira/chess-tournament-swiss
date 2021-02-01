import {UserDto} from "./user.model";
import shortid from 'shortid';
import debug from 'debug';
import {USER_STATE} from "../../contants/contants";
const log: debug.IDebugger = debug('app:in-memory-dao');

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class UserDao {
	private static instance: UserDao;
	user: Array<UserDto> = [];
	
	constructor() {
		log('Created new instance of UserDao');
	}
	
	static getInstance(): UserDao {
		if (!UserDao.instance) {
			UserDao.instance = new UserDao();
		}
		return UserDao.instance;
	}
	
	async addUser(user: UserDto) {
		user.id = shortid.generate();
		user.state = USER_STATE.ACTIVE;
		this.user.push(user);
		return user.id;
	}
	
	async getUsers() {
		return this.user;
	}
	
	async getUserById(userId: string) {
		return this.user.find((user: { id: string; }) => user.id === userId);
	}
	
	async putUserById(user: UserDto) {
		const objIndex = this.user.findIndex((obj: { id: string; }) => obj.id === user.id);
		this.user.splice(objIndex, 1, user);
		return `${user.id} updated via put`;
	}
	
	async patchUserById(user: UserDto) {
		const objIndex = this.user.findIndex((obj: { id: string; }) => obj.id === user.id);
		let currentUser = this.user[objIndex];
		const allowedPatchFields = ["email", "firstName", "lastName", "password", "permissionLevel", "rating", "state"];
		for (let field of allowedPatchFields) {
			if (field in user) {
				// @ts-ignore
				currentUser[field] = user[field];
			}
		}
		this.user.splice(objIndex, 1, currentUser);
		return `${user.id} patched`;
	}
	
	async removeUserById(userId: string) {
		const objIndex = this.user.findIndex((obj: { id: string; }) => obj.id === userId);
		this.user.splice(objIndex, 1);
		return `${userId} removed`;
	}
	
	async getUserByEmail(email: string) {
		const objIndex = this.user.findIndex((obj: { email: string; }) => obj.email === email);
		let currentUser = this.user[objIndex];
		if (currentUser) {
			return currentUser;
		} else {
			return null;
		}
	}
	
}

export default UserDao.getInstance();
