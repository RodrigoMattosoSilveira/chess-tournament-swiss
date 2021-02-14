import {PlayerDto} from "./player.model";
import shortid from 'shortid';
import debug from 'debug';
import {PLAYER_STATE, PLAYER_PATCHABLE_ATTRIBUTES} from "../../contants/contants";

const log: debug.IDebugger = debug('app:in-memory-dao');

/**
 * Using the singleton pattern, this class will always provide the same instance—and, critically, the same user
 * array, when we import it in other files. For that, we declare two things:
 * The static variable, instance, to hold a single object of the UsersDao class.
 * The static getInstance() function, which will first create a new UsersDao (if needed) and return the current
 * instance.
 */
class PlayerDao {
	private static instance: PlayerDao;
	collection: Array<PlayerDto> = [];
	
	constructor() {
		log('Created new instance of PlayerDao');
	}
	
	static getInstance(): PlayerDao {
		if (!PlayerDao.instance) {
			PlayerDao.instance = new PlayerDao();
		}
		return PlayerDao.instance;
	}
	
	async add(entity: PlayerDto) {
		// console.log("PlayerDao/add: " + JSON.stringify(entity) +"\n");
		entity.id = shortid.generate();
		entity.hadByeOrForfeit = false;
		entity.byeNextRound = false;
		entity.playedAgainst = [];
		entity.playedColor = [];
		entity.results = [];
		entity.state = PLAYER_STATE.ACTIVE;
		this.collection.push(entity);
		// console.log("PlayerDao/add id: " +entity.id +"\n");
		return entity.id;
	}
	
	async getAll() {
		return this.collection;
	}
	
	async getById(id: string) {
		return this.collection.find((user: { id: string; }) => user.id === id);
	}
	
	async putById(entity: PlayerDto) {
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		this.collection.splice(objIndex, 1, entity);
		return `${entity.id} updated via put`;
	}
	
	async patchById(entity: PlayerDto) {
		const objIndex = this.collection.findIndex((obj: { id: string; }) => obj.id === entity.id);
		let currentEntity = this.collection[objIndex];
		for (let field of PLAYER_PATCHABLE_ATTRIBUTES) {
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
	
	async getPlayersByTournament(tournament: string) {
		// console.log('PlayerDao/getByTournament: ' + tournament)
		// console.log('PlayerDao/getByTournament: ' + JSON.stringify(this.collection))
		return this.collection.filter((player:PlayerDto ) => player.tournament === tournament);
	}
	
}

export default PlayerDao.getInstance();
