# users
Model a site user (not yet refactored to model our chess site user)

#curl
## GET ALL USERS
Use the following `curl` command to retrieve all users:
````bash
$ curl --location --request GET 'localhost:3000/user' --header 'Content-Type: application/json'
````

## POST
Use the following `curl` command to create a user:
````bash
curl --location --request POST 'localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
"firstName": "rodrigo",
"lastName": "silveira",
"email": "rodrigo.silveira@coolprovider.com",
"password": "sup3rS3cr3tPassw0rd!23",
"permissionLevel": 0,
"rating": 1234
}'
````

Once executed, the service returns a user id 
````json
{
    "id": "ksVnfnPVW"
}
````

Use the terminal to create an environment variable to help us with the remaining curl examples

````bash
$ REST_API_EXAMPLE_ID="put_your_id_here"
````

## GET A USER
Use the following `curl` command to retrieve a user:
````bash
$ curl --location --request GET "localhost:3000/user/$REST_API_EXAMPLE_ID" --header 'Content-Type: application/json'
````

## PUT
Use the following `curl` command to update the whole record:
````bash
$ curl --location --request PUT "localhost:3000/user/$REST_API_EXAMPLE_ID" \
--header 'Content-Type: application/json' \
--data-raw '{
"email": "marcos.henrique@toptal.com",
"password": "sup3rS3cr3tPassw0rd!23",
"firstName": "Marcos",
"lastName": "Silva",
"permissionLevel": 8
}'
````
## PATCH
Use the following `curl` command to update the email address:
````bash
curl --location --request PATCH "localhost:3000/users/$REST_API_EXAMPLE_ID" \
--header 'Content-Type: application/json' \
--data-raw '{
    "lastName": "Mattoso"
}'
````

## DELETE
Use the following `curl` delete a user:
````bash
curl --location --request DELETE "localhost:3000/user/$REST_API_EXAMPLE_ID" \
--header 'Content-Type: application/json'
````
