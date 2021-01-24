import { Request, Response } from 'express';
import { CrudController } from '../../abstractions/CRUDController';
import { players } from "./player";

export class PlayerController extends CrudController {
	public create(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		// throw new Error("Method not implemented.");
		/**
		 * cURL command to create a player
		 * curl -X POST -H "Content-Type: application/json" -d '{"id": 100001, "fistName": "John", "lastName": "Doe", "rating": "1567"}' http://localhost:3000/player
		 */
		console.log("PlayerController/POST/body: " + JSON.stringify(req.body));
		res.json({
			method: "POST",
			entity: '/player',
			params: req.params,
			body: req.body
		});
	}
	
	public read(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		// throw new Error("Method not implemented.");
		/**
		 * cURL command to read a player
		 * curl -v http://localhost:3000/player/10001
		 *
		 * cURL command to read all players
		 * curl -v http://localhost:3000/player
		 */
		console.log("PlayerController/GET: " + JSON.stringify(req.params));
		res.json({
			method: "GET",
			entity: '/player',
			params: req.params, // read all players, if empty
			body: req.body
		});
	}
	
	public update(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		// throw new Error("Method not implemented.");
		/**
		 * cURL command to update a player
		 * curl -X PUT -v -H "Content-Type: application/json" -d '{"fistName": "John"}' http://localhost:3000/player/100001
		 */
		console.log("PlayerController/PUT/params: " + JSON.stringify(req.params));
		console.log("PlayerController/PUT/body: " + JSON.stringify(req.body));
		res.json({
			method: "PUT",
			entity: '/player',
			params: req.params,
			body: req.body
		});
	}
	
	public delete(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response): void {
		// throw new Error("Method not implemented.");
		/**
		 * cURL command to update a player
		 * curl -X DELETE  http://localhost:3000/player/100001
		 */
		console.log("PlayerController/DELETE/params: " + JSON.stringify(req.params));
		res.json({
			method: "DELETE",
			entity: '/player',
			params: req.params,
			body: req.body
		});
	}
}
