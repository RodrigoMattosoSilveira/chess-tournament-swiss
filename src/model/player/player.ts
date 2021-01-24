import  { COLOR, SCORE } from '../../contants/contants'

type IPlayer = {
	id: number;								// random 6 digit number;
	firstName: string;
	lastName: string;
	rating: number;							// random 4 digit number between 1000 and 2100, for now
}
type IPlayerId = IPlayer["id"];
export { IPlayer }
export { IPlayerId }

export class Player {
	private _id: number;								// random 12 digit number;
	private _firstName: string;
	private _lastName: string;
	private _rating: number;
	
	constructor(id: number, firstName: string, lastName: string, rating: number) {
		this._id = id;
		this._firstName = firstName;
		this._lastName = lastName;
		this._rating = rating;
	}
	
	get id(): number {
		return this._id;
	}
	
	set id(value: number) {
		this._id = value;
	}
	
	get firstName(): string {
		return this._firstName;
	}
	
	set firstName(value: string) {
		this._firstName = value;
	}
	
	get lastName(): string {
		return this._lastName;
	}
	
	set lastName(value: string) {
		this._lastName = value;
	}
	
	get rating(): number {
		return this._rating;
	}
	
	set rating(value: number) {
		this._rating = value;
	}
}

// Define the Players collection as a singleton.
type  IPlayers = {
	[key: number]: Player
}
export class Players  {
	private _players:IPlayers = {};
	
	constructor() {
		this._players = {};
	}
	
	get players(): IPlayers {
		return this._players;
	}
	
	set players(value: IPlayers) {
		this._players = value;
	}
	
	getPlayersLength(): number {
		return Object.keys(this._players).length;
	}
	
	getPlayer(id: number): Player {
		return this._players[id];
	}
	
	addPlayer(player: Player) {
		let id = player.id;
		this._players[id] = player;
	}
}
const players: Players = new Players();

export { players };




