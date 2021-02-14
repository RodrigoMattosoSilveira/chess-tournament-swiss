import shortid from 'shortid';
import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');

import {GameDto} from "./game.model";
import { STATES, PATCHABLE_ATTRIBUTES } from "./game.constants";

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class GameDao {
	private static instance: GameDao;
	collection: Array<GameDto> = [];
	
	constructor() {
		log('Created new instance of PlayerDao');
	}
	
	static getInstance(): GameDao {
		if (!GameDao.instance) {
			GameDao.instance = new GameDao();
		}
		return GameDao.instance;
	}
	
	async add(entity: GameDto) {
		// console.log("GameDao/add: " + JSON.stringify(entity) +"\n");
		entity.id = shortid.generate();
		if (entity.state) {
			entity.state = STATES.SCHEDULED
		}
		if (entity.result) {
			delete entity.result
		}
		if (entity.date) {
			let date: Date = new Date();
			entity.date = "" + date.getMonth() + '/' + date.getDay() + date.getFullYear();
		}
		this.collection.push(entity);
		// console.log("GameDao/add id: " +entity.id +"\n");
		return entity.id;
	}
	
	async getAll() {
		// console.log("\nGameDao/getAll: \n");
		return this.collection;
	}
	
	async getById(id: string) {
		// console.log("\nGameDao/getAll: \n");
		return this.collection.find((game: { id: string; }) => game.id === id);
	}
	
	async putById(entity: GameDto) {
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		this.collection.splice(objIndex, 1, entity);
		return `${entity.id} updated via put`;
	}
	
	async patchById(entity: GameDto) {
		// console.log("\nGameDao/patchById: " + JSON.stringify(PATCHABLE_ATTRIBUTES) + "\n");
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		let currentEntity = this.collection[objIndex];
		for (let field of PATCHABLE_ATTRIBUTES) {
			if (field in entity) {
				// @ts-ignore
				currentEntity[field] = entity[field];
			}
		}
		this.collection.splice(objIndex, 1, currentEntity);
		return `${entity.id} patched`;
	}
	
	async removeById(id: string) {
		// Note that we do not remove players; we set set them to "withdrew" or "forfeited"
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === id);
		this.collection.splice(objIndex, 1);
		return `${id} removed`;
	}
	
	async getGamesByTournament(tournament: string) {
		// console.log('PlayerDao/getByTournament: ' + tournament)
		// console.log('PlayerDao/getByTournament: ' + JSON.stringify(this.collection))
		return this.collection.filter((game:GameDto) => game.tournament === tournament);
	}
	
}
export default GameDao.getInstance();
