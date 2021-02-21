const fs = require('fs');
import shortid from 'shortid';
import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');

import {ROUND_STATE, ROUND_PATCHABLE_ATTRIBUTES, ROUND_DOUBLE_PATCHABLE_ATTRIBUTES} from "./round.constants";

import { RoundDto} from "./round.model";

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class RoundDao {
	private static instance: RoundDao;
	private static collection: Array<RoundDto> = [];
	
	constructor() {
		log('Created new instance of RoundDao');
	}
	
	static getInstance(): RoundDao {
		if (!RoundDao.instance) {
			RoundDao.instance = new RoundDao();
			if (process.env.NODE_DATA === '_generated') {
				try {
					const data = fs.readFileSync('./generated-data/round.generated.json', 'utf8')
					RoundDao.collection = JSON.parse(data)
				} catch (err) {
					console.error(err)
				}
			}
		}
		return RoundDao.instance;
	}
	
	async add(entity: RoundDto) {
		// console.log("RoundDao/add: " + JSON.stringify(entity) +"\n");
		entity.id = shortid.generate();
		entity.state = ROUND_STATE.SCHEDULED;
		entity.games = [];
		RoundDao.collection.push(entity);
		// console.log(`RoundDao.add.collection: ` + JSON.stringify(RoundDao.collection))
		return entity.id;
	}
	
	async getAll() {
		return RoundDao.collection;
	}
	
	async getById(id: string) {
		// console.log(`RoundDao.getById: ` + id)
		// console.log(`RoundDao.patchById.collection: ` + JSON.stringify(RoundDao.collection))
		return RoundDao.collection.find((round: { id: string; }) => round.id === id);
	}
	
	async putById(entity: RoundDto) {
		const objIndex = RoundDao.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		RoundDao.collection.splice(objIndex, 1, entity);
		return `${entity.id} updated via put`;
	}
	
	async patchById(entityPatch: any) {
		// console.log(`RoundDao.patchById.collection: ` + JSON.stringify(RoundDao.collection))
		// console.log(`RoundDao.patchById.entityPatch: ` + JSON.stringify(entityPatch))
		const objIndex = RoundDao.collection.findIndex((obj: { id: string; }) => obj.id === entityPatch.id);
		let currentEntity: any = RoundDao.collection[objIndex];
		for (let field of ROUND_PATCHABLE_ATTRIBUTES) {
			if (field in entityPatch) {
				if (!(field in currentEntity)) {
					// @ts-ignore
					currentEntity[field] = entityPatch[field];
				} else {
					if (ROUND_DOUBLE_PATCHABLE_ATTRIBUTES.findIndex((attribute: string) => attribute === field) !== -1) {
						// @ts-ignore
						currentEntity[field] = entityPatch[field];
					}
				}
			}
		}
		RoundDao.collection.splice(objIndex, 1, currentEntity);
		return `${entityPatch.id} patched`;
	}
	
	async removeById(id: string) {
		// Note that we do not remove rounds; we set set them to "withdrew" or "forfeited"
		const objIndex = RoundDao.collection.findIndex((obj: { id: string; }) => obj.id === id);
		RoundDao.collection.splice(objIndex, 1);
		return `${id} removed`;
	}
}
export default RoundDao.getInstance();
