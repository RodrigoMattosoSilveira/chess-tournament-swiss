#game
Model a chess game between two players

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

##model
    ````typescript
interface GameDto {
id: string, // unique game id
tournament: string, // unique tournament id
whitePiecesPlayer: string, // unique player id, must differ from black
blackPiecesPlayer: string, // unique player id, must differ from white
state: string, // unique state id (scheduled/underway/complete)
result: Array<number>, // -1 black pieces won, 0 tie, 1 white pieces won
date: string,  // a valid game date
}

#curl
## GET ALL GAMES
Use the following `curl` command to retrieve all games:
    ````bash
$ curl --location --request GET 'localhost:3000/game' --header 'Content-Type: application/json'
    ````

## POST
Use the following `curl` command to create a game:
````bash
curl --location --request POST 'localhost:3000/game' \
--header 'Content-Type: application/json' \
--data-raw '{
"tournament": "1",
"whitePiecesPlayer": "1",
"blackPiecesPlayer": "1"
}'
````

NOTE: the `tournament`, `whitePiecesPlayer`, and `blackPiecesPlayer` are fake ids; I'm using them temporarily to write 
the logic and its tests; I'll replace them with valid ids shortly

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
    "result": 1
}'
````

## PUT
Not supported

## DELETE
Not supported
