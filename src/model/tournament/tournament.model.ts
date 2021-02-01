// interface TournamentPlayerDto {
// 	player: number; // UserDto.id
// 	hadByeOrForfeit: boolean;
// 	byeNextRound: boolean;
// 	opponents: Array<number>; // UserDto.id
// 	playedColor: Array<number>;
// 	results: Array<number>;
// 	tournamentPoints: number
// }

export interface TournamentDto {
	id: string;				// created by the server
	name: string;			// must be unique
	city?: string;
	country?: string;
	month?: number;
	year?: number;
	rounds: number;
	maxPlayers: number;
	type: string; //roundRobin, swiss, elimination, match
	players?: Array<number> // TournamentPlayerDto.id
	state?: string; // planned* / scheduled / closed / underway / complete
}
