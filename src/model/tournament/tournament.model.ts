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
	winPoints?: number; // points awarded for a win, 1 is default
	tiePoints?: number; // points awarded for a tie, 0.5 is default
}
