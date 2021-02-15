# game
Model a chess game between two players

# Setup
## Model
A geame consists of a tournament and two players, plus a few additional attributes
````typescript
export interface GameDto {
	id: string,                 // unique game id
	tournament: string,         // unique tournament id
	whitePiecesPlayer: string,  // unique player id, must differ from black
	blackPiecesPlayer: string,  // unique player id, must differ from white
	state?: string,             // unique state id (scheduled/underway/complete)
	result?:number,             // `0-1` black won, `1/1-1/2` tie, `1-0` white won, NAN* no result yet
	date?: string,              // a valid game date, game creationg date*
}
````

Note that the attributes required to create a game are the `tournament id`, the `white pieces' player id`, and the `black pieces' player id`. All other values are set to their defaults.
* id - Is generated when creating a tournament player;
* user - the generated user id;
* tournament - the tournament id where this game is played;
* whitePiecesPlayer - the player with the white pieces;
* blackPiecesPlayer - the player with the black pieces`;
* state - the state of the game, default is `scheduled`;
* result - the game result, default is non existent;
* date - the date the game is scheduled to be played, default is game creationg date;

#curl
## GET ALL GAMES
Use the following `curl` command to retrieve all tournaments:
````bash
curl --location --request GET 'localhost:3000/game' --header 'Content-Type: application/json'
````

Once executed, the service returns collection of games
````json
[
  { }, {}
]
````

See the GameDto above for details on the game model.

## POST
Use the following `curl` command to create a game:
````bash
curl --location --request POST 'localhost:3000/game' \
--header 'Content-Type: application/json' \
--data-raw '{
"tournament": "<tournament id>",
"whitePiecesPlayer": "player id",
"blackPiecesPlayer": "player id"
}'
````

NOTE: the `tournament`, `whitePiecesPlayer`, and `blackPiecesPlayer` are fake ids; you will have to use real ids;

Once executed, the service returns a game id
````json
{
    "id": "ksVnfnPVW"
}
````

Use the terminal to create an environment variable to help us with the remaining curl examples

````bash
$ REST_API_GAME_ID="put_your_id_here"
````


## GET A GAME
Use the following `curl` command to retrieve a tournament:
````bash
$ curl --location --request GET "localhost:3000/game/$REST_API_GAME_ID" --header 'Content-Type: application/json'
````

The service returns the service returns the tournament's entity attributes:
````json
{
  "tournament":"1","whitePiecesPlayer":"1","blackPiecesPlayer":"1","id":"a-s1mI78W"
}
````

## PATCH
Use the following `curl` command to update the maximum number of players:
````bash
curl --location --request PATCH "localhost:3000/game/$REST_API_GAME_ID" \
--header 'Content-Type: application/json' \
--data-raw '{
  "state": "complete",
  "result": "w-resigned"
}'
````

## PUT
Not supported

## DELETE
Not supported


##TODO
* Added tournament win: number, points for win;
    * update valid attributes
* update dao
* update validator
* update tests
* Added tournament tie: number, points for tie
    * update valid attributes
* update dao
* update validator
* update tests
