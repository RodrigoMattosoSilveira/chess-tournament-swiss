import {TournamentDto} from "./tournament.model";
import shortid from 'shortid';
import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');
import {TOURNAMENT_STATE} from "../../contants/contants";

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class TournamentDao {
	private static instance: TournamentDao;
	collection: Array<TournamentDto> = [];
	
	constructor() {
		log('Created new instance of TournamentDao');
	}
	
	static getInstance(): TournamentDao {
		if (!TournamentDao.instance) {
			TournamentDao.instance = new TournamentDao();
		}
		return TournamentDao.instance;
	}
	
	async add(entity: TournamentDto) {
		// console.log("TournamentDao/add: " + JSON.stringify(entity) +"\n");
		entity.id = shortid.generate();
		entity.state = TOURNAMENT_STATE.PLANNED;
		entity.players = [];
		this.collection.push(entity);
		// console.log("TournamentDao/add id: " +entity.id +"\n");
		return entity.id;
	}
	
	async getAll() {
		return this.collection;
	}
	
	async getById(id: string) {
		return this.collection.find((user: { id: string; }) => user.id === id);
	}
	
	async putById(entity: TournamentDto) {
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		this.collection.splice(objIndex, 1, entity);
		return `${entity.id} updated via put`;
	}
	
	async patchById(entity: TournamentDto) {
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		let currentEntity = this.collection[objIndex];
		const allowedPatchFields = ["name", "city", "country", "month", "year", "rounds", "maxPlayers", "type", "players", "state"];
		for (let field of allowedPatchFields) {
			if (field in entity) {
				// @ts-ignore
				currentEntity[field] = entity[field];
			}
		}
		this.collection.splice(objIndex, 1, currentEntity);
		return `${entity.id} patched`;
	}
	
	async removeById(id: string) {
		// Note that we do not remove tournaments; we
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === id);
		this.collection.splice(objIndex, 1);
		return `${id} removed`;
	}
	
	async getByName(name: string) {
		// console.log('TournamentDao/getByName: ' + name)
		// console.log('TournamentDao/getByName: ' + JSON.stringify(this.collection))
		const objIndex = this.collection.findIndex((obj: { name: string; }) => obj.name === name);
		let currentEntity = this.collection[objIndex];
		if (currentEntity) {
			return currentEntity;
		} else {
			return null;
		}
	}
	
}

export default TournamentDao.getInstance();
