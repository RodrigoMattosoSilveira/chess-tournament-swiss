export interface PlayerDto {
	id: string;						// created by the server
	user: string;					// must be unique
	tournament: string;				// must be unique
	hadByeOrForfeit?: boolean;		// True after player had a bye or was awarded a forfeit
	byeNextRound?: boolean;			// True if player is scheduled for next round bye
	playedAgainst?: Array<number>; 	// Players (not users)
	playedColor?: Array<number>; 	// -1=Black, 1=White
	results?: Array<number>; 		// -1 = loss, 0.5=tie, 1=win
	state?:string; 		    // scheduled, withdrew, playing, forfeit, done
}
