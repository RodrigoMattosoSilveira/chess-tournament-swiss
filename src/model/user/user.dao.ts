// const fs = require('fs');
import debug from 'debug';
import { Ok, Err } from 'space-monad';
const log: debug.IDebugger = debug('app:in-memory-dao');

import { DaoResult } from "../../common/generic.interfaces";
import { One, Many } from '@rmstek/rms-ts-monad';
import {IUserPatch, USER_PATCH_KEYS, UserDto} from "./user.interfaces";
import { IUserMongoDoc, UserMongo} from "./user-mongo";
import { UserUtil } from "./user.util";
import { HttpResponseCode } from '../../contants/contants';

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class UserDao {
	private static instance: UserDao;
	userUtil: UserUtil = UserUtil.getInstance();

	constructor() {
		log('Created new instance of UserDao');
	}

	static getInstance(): UserDao {
		if (!UserDao.instance) {
			UserDao.instance = new UserDao();
			if (process.env.NODE_DATA === 'generated') {
				try {
					// const data = fs.readFileSync('./generated-data/users.generated.json', 'utf8')
				} catch (err) {
					console.error(err)
				}
			}
		}
		return UserDao.instance;
	}

	/**
	 * Createa  user document
	 * @param user
	 * @returns userDaoResult: UserDaoResult
	 */
	async create(user: UserDto): Promise< DaoResult<UserDto, UserDto[]>> {
		// Error handling
		// https://stackoverflow.com/questions/50905750/error-handling-in-async-await
		// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
		let daoResult: DaoResult<UserDto, UserDto[]>;
		const userMongo = UserMongo.build({...user})
		try {
			let userSaved = await userMongo.save();
			let useDto: UserDto = this.userUtil.fromMongoToUser(userSaved);
			// 201 Created record
			daoResult = {code: HttpResponseCode.created, content: Ok(One(useDto))};
		}
		catch (error)  {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err("Unable to save user entity")};
		}
		return daoResult;
	}

	/**
	 * Returns all use documents
	 */
	async list(): Promise< DaoResult<UserDto, UserDto[]>> {
		let daoResult: DaoResult<UserDto, UserDto[]>;
		let users: UserDto[] = [];
		try {
			// Read all documents
			let usersRead: IUserMongoDoc[] = await UserMongo.find({}).exec();
			if (usersRead) {
				// @ts-ignore
				for (let userRead: IUserMongoDoc of usersRead) {
					// @ts-ignore
					let user: UserDto = this.userUtil.fromMongoToUser(userRead);
					users.push(user);
				}
				// 200 Ok
				daoResult = {code: HttpResponseCode.ok, content: Ok(Many(users))};
			}
			else {
				// 404 Not Found
				daoResult = {code: HttpResponseCode.not_found, content: Err("Did not find any users")};
			}
		}
		catch (error) {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err("Unable to read user entities")};
		}
		return daoResult;
	}

	/**
	 * Reads a user document with a specific userId
	 * @param userId
	 * @returns userDaoResult: UserDaoResult
	 */
	async readById(userId: string): Promise< DaoResult<UserDto, UserDto[]>> {
		let daoResult: DaoResult<UserDto, UserDto[]>;
		// Find one entity whose `id` is 'id', otherwise `null`
		try {
			let userRead = await UserMongo.findOne({id: userId}).exec();
			if (userRead) {
				// Found, 200 = Ok
				let user: UserDto = this.userUtil.fromMongoToUser(userRead);
				// 200 Ok
				daoResult = {code: HttpResponseCode.ok, content: Ok(One(user))};
			}
			else {
				// 404 Not Found
				daoResult = {code: HttpResponseCode.not_found, content: Err(`Did not find any user with id: ${userId}`)};
			}
		}
		catch (error) {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err(`Did not find any user with id: ${userId}`)};
		}
		return daoResult;
	}

	/**
	 * Verifies whether a user document with a specific id  exists
	 * @param id
	 * @returns exists: boolean
	 */
	async idExists(id: string): Promise<boolean> {
		let exists: boolean;
		let daoResult: DaoResult<UserDto, UserDto[]> = await this.readById(id);
		switch (daoResult.code) {
			case /* 200 */
			HttpResponseCode.ok:
				exists = true;
				break;
			default:
				exists = false;
				break;
		}
		return exists;
	}

	/**
	 * Reads a user document with a specific email
	 * @param email
	 * @returns userDaoResult: UserDaoResult
	 */
	async getByEmail(email: string): Promise< DaoResult<UserDto, UserDto[]>> {
		// Error handling
		// https://stackoverflow.com/questions/50905750/error-handling-in-async-await
		// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
		let daoResult: DaoResult<UserDto, UserDto[]>;
		try {
			let userRead = await UserMongo.findOne({email: email}).lean();
			if (userRead) {
				// 200 Ok
				daoResult = {code: HttpResponseCode.ok, content: Ok(One(userRead))};
			}
			else {
				// 404 Not Found
				daoResult = {code: HttpResponseCode.not_found, content: Err(`Did not find any user with email: ${email}`)};
			}
		}
		catch (err) {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err(`Ser error search user email: ${email}`)};
		}
		return daoResult;
	}

	/**
	 * Verifies whether a user document with a specific email  exists
	 * @param email
	 * @returns exists: boolean
	 */
	async emailExists(email: string): Promise<boolean> {
		let exists: boolean;
		let daoResult: DaoResult<UserDto, UserDto[]> = await this.getByEmail(email)
		switch (daoResult.code) {
			case /* 200 */ HttpResponseCode.ok:
				exists = true;
				break;
			default:
				exists = false;
				break;
		}
		return exists;
	}

	patchUserById(user: IUserPatch):  Promise< DaoResult<UserDto, UserDto[]>> {
		// console.log(`UserDao/Patch: ${JSON.stringify(user)}`);
		let daoResult: DaoResult<UserDto, UserDto[]>;
		// Do not use lean, so that we have the save method!
		let conditions = {id: user.id};
		let update = {}
		for (let field of USER_PATCH_KEYS) {
			if (field in user) {
				// @ts-ignore
				update[field] = user[field];
			}
		}
		let options = {new: true};
		// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
		UserMongo.findOneAndUpdate(conditions, update, options)
			.then((user: any) => {
				if (user) {
					// 200 Ok
					delete user.password;
					daoResult = {code: HttpResponseCode.ok, content: Ok(One(user))};
				}
				else {
					// Did not find, 204 = No Content
					// 404 Not Found
					daoResult = {code: HttpResponseCode.not_found, content: Err(`Did not find any user id ${user.id}, not patched`)};
				}
			})
			.catch(() => {
				// 500 Internal Server Error
				daoResult = {code: HttpResponseCode.internal_server_error, content: Err(`Service error patching user id: ${user.id}`)};
			})
		// @ts-ignore
		return daoResult;
	}

	// Not supported
	// async deleteById(userId: string): Promise<string> {
	// 	const objIndex = UserDao.user.findIndex((obj: { id: string; }) => obj.id === userId);
	// 	UserDao.user.splice(objIndex, 1);
	// 	return `${userId} removed`;
	// }

	// Not supported
	// async putUserById(user: UserDto) {
	// 	const objIndex = UserDao.user.findIndex((obj: { id: string; }) => obj.id === user.id);
	// 	UserDao.user.splice(objIndex, 1, user);
	// 	return `${user.id} updated via put`;
	// }

}

export default UserDao.getInstance();
