import { Request, Response } from 'express';
import { CrudController } from '../CrudController';
const users = require('../../static/users.json');


export class UserController extends CrudController {
	public create(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		throw new Error("Method not implemented.");
	}
	
	public read(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		// throw new Error("Method not implemented.");
		// res.json({ message: 'GET /user request received' });
		res.json({ users: users });
	}
	
	public update(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		throw new Error("Method not implemented.");
	}
	
	public delete(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		throw new Error("Method not implemented.");
	}
}
