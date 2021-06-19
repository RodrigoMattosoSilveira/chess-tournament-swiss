import {DaoResult} from "../../common/generic.interfaces";

const fs = require('fs');
import debug from 'debug';
import { Ok, Err } from 'space-monad';
const log: debug.IDebugger = debug('app:in-memory-dao');

import { UserDto } from "./user.model";
import { UserMongo } from "./user-mongo";
import {UserDaoResult} from "./user.interfaces";

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class UserDao {
	private static instance: UserDao;

	constructor() {
		log('Created new instance of UserDao');
	}

	static getInstance(): UserDao {
		if (!UserDao.instance) {
			UserDao.instance = new UserDao();
			if (process.env.NODE_DATA === 'generated') {
				try {
					const data = fs.readFileSync('./generated-data/users.generated.json', 'utf8')
				} catch (err) {
					console.error(err)
				}
			}
		}
		return UserDao.instance;
	}

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

	list(): DaoResult {
		let daoResult: DaoResult | undefined;
		UserMongo.find({})
			.then((user: UserDto[]) => {
				// 200 = Ok
				daoResult = Ok({code: 200, content: JSON.stringify(user)});
			})
			.catch((error: any) => {
				daoResult = Err({code: 400, content: JSON.stringify(error.errors)});
			})
		// @ts-ignore
		return daoResult;
	}

	readById(userId: string): DaoResult {
		let daoResult: DaoResult | undefined = undefined;
		// Find one entity whose `id` is 'id', otherwise `null`
		UserMongo.findOne({id: userId}).lean()
			.then((user: any) => {
				if (user) {
					// Found, 200 = Ok
					daoResult = Ok({code: 200, content: JSON.stringify(user)});
				}
				else {
					// Did not find, 204 = No Content
					daoResult = Ok({code: 204, content: "No content"});
				}
			})
			.catch((error: any) => {
				daoResult = Err({code: 400, content: JSON.stringify(error.errors)});
			})
		// @ts-ignore
		return daoResult;
	}

	idExists(id: string): boolean {
		const daoResult: DaoResult | undefined = this.readById(id);
		let exists: boolean = false;
		daoResult.fold(
			err => {
				exists = false;
			},
			result => {
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

	getByEmail(email: string): boolean {
		let exist: boolean = false;
		// Find one entity whose `id` is 'id', otherwise `null`
		UserMongo.findOne({email: email}).lean()
			.then((user: any) => {
				if (user) {
					// Found, 200 = Ok
					exist = true;
				}
				else {
					// Did not find, 204 = No Content
					exist = false;
				}
			})
			.catch((error: any) => {
				exist = false
			})
		// @ts-ignore
		return exist;
	}

	emailExists(email: string): boolean {
		return this.getByEmail(email);
	}

	patchUserById(user: UserDto): DaoResult {
		let daoResult: DaoResult | undefined;
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
					daoResult = Ok({code: 200, content: JSON.stringify(user)});
				}
				else {
					// Did not find, 204 = No Content
					daoResult = Ok({code: 204, content: "No content"});
				}
			})
			.catch((error: any) => {
				daoResult = Err({code: 400, content: JSON.stringify(error.errors)});
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
