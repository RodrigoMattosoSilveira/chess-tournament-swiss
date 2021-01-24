import {Player, Players} from "./player";
import app from "../../index";
let supertest = require("supertest");

const seedPlayers: Array<Player> = require('../../seed-data/players-seed.json');

describe('Player', () => {
	let id = 100001;
	let firstName = "Paul";
	let lastName = "Jones";
	let rating = 1567;
	let player: Player;
	let players: Players;
	let request: any;
	describe('Given a set of valid attributes', () => {
		test("The player constructor returns a valid record", () => {
			let player = new Player(id, firstName, lastName, rating);
			expect(player.id).toEqual(id);
			expect(player.firstName).toEqual(firstName)
			expect(player.lastName).toEqual(lastName)
			expect(player.rating).toEqual(rating);
		});
	});
	describe('Given a valid player', () => {
		beforeEach(() => {
			player = new Player(id, firstName, lastName, rating);
			players = new Players();
		});
		test("The players collection constructor returns a valid collection", () => {
			expect(players.getPlayersLength()).toEqual(0)
		});
		test("The players collection adds the player correctly", () => {
			players.addPlayer(player);
			expect(players.getPlayersLength()).toEqual(1);
			let addedPlayer: Player = players.getPlayer(player.id);
			expect(addedPlayer).toEqual(player);
		});
	});
	describe('Given valid seed players', () => {
		beforeEach(() => {
			players = new Players();
		});
		test("The players collection constructor returns a valid collection", () => {
			for (let i = 0; i < seedPlayers.length; i++) {
				id = seedPlayers[i].id;
				firstName = seedPlayers[i].firstName;
				lastName = seedPlayers[i].lastName;
				rating = seedPlayers[i].rating;
				let newPlayer = new Player(id, firstName, lastName, rating)
				players.addPlayer(newPlayer);
			}
			expect(players.getPlayersLength()).toEqual(49)
		});
	});
});
