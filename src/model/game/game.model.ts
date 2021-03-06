/**
 * We interpret the result array as follows:
 * [w, 0, 0] - Black won; w is the number of points awarded for a tournament win;
 * [0, t, 0] - Tie; y is the number of points awarded for a tournament tie;
 * [0, 0, w] - White won; w is the number of points awarded for a tournament win;
 */
export interface GameDto {
	id: string, 				// unique game id
	tournament: string, 		// unique tournament id
	whitePiecesPlayer: string, 	// unique player id, must differ from black
	blackPiecesPlayer: string, 	// unique player id, must differ from white
	state?: string, 			// state (scheduled*/underway/complete)
	result?:string, 			// `b` black won, `t` tie, `w` white won; NAN*, created when the game completes
	date?: string,  			// a valid game date, creation date*
}

