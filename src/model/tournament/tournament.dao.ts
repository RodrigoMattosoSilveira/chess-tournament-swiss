const fs = require('fs');
import shortid from 'shortid';
import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');

import {TournamentDto} from "./tournament.model";
import {TOURNAMENT_PATCHABLE_ATTRIBUTES, TOURNAMENT_STATE} from "../../contants/contants";

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class TournamentDao {
	private static instance: TournamentDao;
	private static collection: Array<TournamentDto> = [];
	
	constructor() {
		log('Created new instance of TournamentDao');
	}
	
	static getInstance(): TournamentDao {
		if (!TournamentDao.instance) {
			TournamentDao.instance = new TournamentDao();
			if (process.env.NODE_DATA === 'generated') {
				try {
					const data = fs.readFileSync('./generated-data/tournament.generated.json', 'utf8')
					TournamentDao.collection = JSON.parse(data)
				} catch (err) {
					console.error(err)
				}
			}
		}
		return TournamentDao.instance;
	}
	
	async add(entity: TournamentDto) {
		// console.log("TournamentDao/add: " + JSON.stringify(entity) +"\n");
		// Set defaults
		entity.id = shortid.generate();
		entity.state = TOURNAMENT_STATE.PLANNED;
		entity.players = [];
		if (!entity.winPoints) {
			entity.winPoints = 1;
		}
		if (!entity.tiePoints) {
			entity.tiePoints = 0.5;
		}
		TournamentDao.collection.push(entity);
		// console.log("TournamentDao/add id: " +entity.id +"\n");
		return entity.id;
	}
	
	async getAll() {
		return TournamentDao.collection;
	}
	
	async getById(id: string) {
		return TournamentDao.collection.find((user: { id: string; }) => user.id === id);
	}
	
	async putById(entity: TournamentDto) {
		const objIndex = TournamentDao.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		TournamentDao.collection.splice(objIndex, 1, entity);
		return `${entity.id} updated via put`;
	}
	
	async patchById(entity: TournamentDto) {
		const objIndex = TournamentDao.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		let currentEntity = TournamentDao.collection[objIndex];
		for (let field of TOURNAMENT_PATCHABLE_ATTRIBUTES) {
			if (field in entity) {
				// @ts-ignore
				currentEntity[field] = entity[field];
			}
		}
		TournamentDao.collection.splice(objIndex, 1, currentEntity);
		return `${entity.id} patched`;
	}
	
	async removeById(id: string) {
		// Note that we do not remove tournaments; we
		const objIndex = TournamentDao.collection.findIndex((obj: { id: string; }) => obj.id === id);
		TournamentDao.collection.splice(objIndex, 1);
		return `${id} removed`;
	}
	
	async getByName(name: string) {
		// console.log('TournamentDao/getByName: ' + name)
		// console.log('TournamentDao/getByName: ' + JSON.stringify(TournamentDao.collection))
		const objIndex = TournamentDao.collection.findIndex((obj: { name: string; }) => obj.name === name);
		let currentEntity = TournamentDao.collection[objIndex];
		if (currentEntity) {
			return currentEntity;
		} else {
			return null;
		}
	}
	
}

export default TournamentDao.getInstance();
