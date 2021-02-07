# tournament
Model a tournament

#curl
## GET ALL TOURNAMENTS
Use the following `curl` command to retrieve all tournaments:
````bash
curl --location --request GET 'localhost:3000/tournament' --header 'Content-Type: application/json'
````

The service returns a tournament collection:
````json
[
  {"name":"Tata Steel Chess 1","year":2021,"maxPlayers":48,"rounds":6,"type":"swiss","id":"v55YaUAmh","state":"planned","players":[]},
  {"name":"Tata Steel Chess 2","year":2021,"maxPlayers":48,"rounds":6,"type":"swiss","id":"Fo4RU7lH3","state":"planned","players":[]}
]
````

## POST
Use the following `curl` command to create a tournament:
````bash
curl --location --request POST 'localhost:3000/tournament' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "Tata Steel Chess",
"city": "Wijk aan Zee",
"year": 2021,
"maxPlayers": 48,
"rounds": 6,
"type": "swiss"
}'
````

The service returns the created tournament's id:
````json
{

 "id":"v55YaUAmh"
}
````

When experimenting with a particular tournment, the terminal to create an environment variable to help you:

````bash
$ REST_API_EXAMPLE_ID=v55YaUAmh
````

## GET A TOURNAMENT
Use the following `curl` command to retrieve a tournament:
````bash
$ curl --location --request GET "localhost:3000/tournament/$REST_API_EXAMPLE_ID" --header 'Content-Type: application/json'
````

The service returns the created tournament's id:
````json
{
  "name":"Tata Steel Chess 2","year":2021,"maxPlayers":48,"rounds":6,"type":"swiss","id":"Fo4RU7lH3","state":"planned","players":[]
}
````

## PATCH
Use the following `curl` command to update the maximum number of players:
````bash
curl --location --request PATCH "localhost:3000/tournament/$REST_API_EXAMPLE_ID" \
--header 'Content-Type: application/json' \
--data-raw '{
    "maxPlayers": 20
}'
````

The service returns the updated tournament's:
````json
{
  "name":"Tata Steel Chess 2","year":2021,"maxPlayers":20,"rounds":6,"type":"swiss","id":"Fo4RU7lH3","state":"planned","players":[]
}
````

You can use the PATCH command to update multipe attributes:
````bash
curl --location --request PATCH "localhost:3000/tournament/$REST_API_EXAMPLE_ID" \
--header 'Content-Type: application/json' \
--data-raw '{
    "maxPlayers": 47,
    "state":"scheduled"
}'
````
## PUT
`This service does not support PUT`

## DELETE
`This service does not support DELETE`
