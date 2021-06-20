// const fs = require('fs');
import debug from 'debug';
import { Ok, Err } from 'space-monad';
const log: debug.IDebugger = debug('app:in-memory-dao');

import {UserDto, UserResultOk, UserDaoResult} from "./user.interfaces";
import {IUserMongoDoc, UserMongo} from "./user-mongo";
import { UserUtil } from "./user.util";

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
	async create(user: UserDto): Promise<UserDaoResult> {
		// Error handling
		// https://stackoverflow.com/questions/50905750/error-handling-in-async-await
		// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
		let userDaoResult: UserDaoResult;
		const userMongo = UserMongo.build({...user})
		try {
			let userSaved = await userMongo.save();
			userDaoResult = Ok({code: 201, content: userSaved});
		}
		catch (error)  {
			userDaoResult = Err({code: 400, content: JSON.stringify(error.errors)});
		}
		return userDaoResult;
	}

	/**
	 * Returns all use documents
	 */
	async list(): Promise<UserDaoResult> {
		let userDaoResult: UserDaoResult;
		let users: UserDto[] = [];
		try {
			// Read all documents
			let usersRead: IUserMongoDoc[] = await UserMongo.find({}).exec();
			if (usersRead) {
				// Found, 200 = Ok
				// @ts-ignore
				for (let userRead: IUserMongoDoc in usersRead) {
					// @ts-ignore
					let user: UserDto = this.userUtil.fromMongoToUser(userRead);
					users.push(user);
				}
				userDaoResult = Ok({code: 200, content: users});
			}
			else {
				// Did not find, 204 = No Content
				userDaoResult = Err({code: 204, content: `Did not find any users`});
			}
		}
		catch (error) {
			userDaoResult = Err({code: 400, content: `Error reading all users`});
		}
		return userDaoResult;

	}

	/**
	 * Reads a user document with a specific userId
	 * @param userId
	 * @returns userDaoResult: UserDaoResult
	 */
	async readById(userId: string): Promise<UserDaoResult> {
		let userDaoResult: UserDaoResult;
		// Find one entity whose `id` is 'id', otherwise `null`
		try {
			let userRead = await UserMongo.findOne({id: userId}, `id firstName lastName email rating state`).exec();
			if (userRead) {
				// Found, 200 = Ok
				let user: UserDto = this.userUtil.fromMongoToUser(userRead);
				userDaoResult = Ok({code: 200, content: user});
			}
			else {
				// Did not find, 204 = No Content
				userDaoResult = Err({code: 204, content: `Did not find user with id = ${userId} `});
			}
		}
		catch (error) {
			userDaoResult = Err({code: 400, content: `Error searching for user with id = ${userId} `});
		}
		return userDaoResult;
	}

	/**
	 * Verifies whether a user document with a specific id  exists
	 * @param id
	 * @returns exists: boolean
	 */
	async idExists(id: string): Promise<boolean> {
		let exists: boolean = false;
		let userDaoResult: UserDaoResult = await this.readById(id);
		userDaoResult.fold(
			(/*err*/) => {
				exists = false;
			},
			(result: UserResultOk) => {
				switch (result.code) {
					case 200:
						exists = true;
						break;
					case 204:
						exists = false;
						break;
					default:
						exists = false;
						break
				}
			},
		);
		return exists;
	}

	/**
	 * Reads a user document with a specific email
	 * @param email
	 * @returns userDaoResult: UserDaoResult
	 */
	async getByEmail(email: string): Promise<UserDaoResult> {
		// Error handling
		// https://stackoverflow.com/questions/50905750/error-handling-in-async-await
		// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
		let userDaoResult: UserDaoResult;
		try {
			let userRead = await UserMongo.findOne({email: email}).lean();
			if (userRead) {
				userDaoResult = Ok({code: 200, content: userRead});
			}
			else {
				userDaoResult = Err({code: 204, content: `User with email ${ email } not found`});
			}
		}
		catch (err) {
			userDaoResult = Err({code: 400, content: `Error reading user with email ${ email }`});
		}
		return userDaoResult;
	}

	/**
	 * Verifies whether a user document with a specific email  exists
	 * @param email
	 * @returns exists: boolean
	 */
	async emailExists(email: string): Promise<boolean> {
		let exists: boolean = false;
		let userDaoResult: UserDaoResult = await this.getByEmail(email)
		userDaoResult.fold(
			(/*err*/) => {
				exists = false;
			},
			(result: UserResultOk) => {
				switch (result.code) {
					case 200:
						exists = true;
						break;
					case 204:
						exists = false;
						break;
					default:
						exists = false;
						break
				}
			},
		);
		return exists;
	}

	patchUserById(user: UserDto):  Promise<UserDaoResult> {
		let userDaoResult: UserDaoResult | undefined;
		// Do not use lean, so that we have the save method!
		let conditions = {id: user.id};
		let update = {}
		const allowedPatchFields = ["email", "firstName", "lastName", "password", "permissionLevel", "rating", "state"];
		for (let field of allowedPatchFields) {
			if (field in user) {
				// @ts-ignore
				update[field] = user[field];
			}
		}
		let options = {new: true};
		// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
		UserMongo.findOneAndUpdate(conditions, update, options).exec()
			.then((user: any) => {
				if (user) {
					// Found, 200 = Ok
					userDaoResult = Ok({code: 200, content: user});
				}
				else {
					// Did not find, 204 = No Content
					userDaoResult = Err({code: 204, content: `Did not patch; user id ${user.id } not found`});
				}
			})
			.catch((error: any) => {
				userDaoResult = Err({code: 400, content: JSON.stringify(error.errors)});
			})
		// @ts-ignore
		return userDaoResult;
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
