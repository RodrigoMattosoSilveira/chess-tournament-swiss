# tournament
Model a tournament

#curl
## GET ALL TOURNAMENTS
Use the following `curl` command to retrieve all tournaments:
````bash
curl --location --request GET 'localhost:3000/tournament' --header 'Content-Type: application/json'
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


curl --location --request POST 'localhost:3000/tournament' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "Tata Steel Ches",
"city": "Wijk aan Zee",
"year": 2021,
"rounds": 6
}'
