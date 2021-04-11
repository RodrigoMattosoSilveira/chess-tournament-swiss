# Introduction
We use `curl` to validate our API's manually, an useful capability during development.

# POST
Use the following `curl` command to create a user:
````bash
curl --location --request POST 'localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
"firstName": "Rodrigo",
"lastName": "Silveira",
"email": "rodrigo.silveira@coolprovider.com",
"password": "sup3rS3cr3tPassw0rd!23",
"permissionLevel": 0,
"rating": 1234
}'
````

Note that the service creates the `state` attribute as `Active` by default. Hence, the service ignores the `state` attribute, if provided.

The service returns a `UserDto` object; see the `user.interfaces.ts` for details.

Use the terminal to create an `environment variable` containing the `new users' id` to help us with the remaining curl examples.

````bash
$ REST_API_USER_ID="new users' id"
````

## GET ALL USERS
Use the following `curl` command to retrieve all users:
````bash
$ curl --location --request GET 'localhost:3000/user' --header 'Content-Type: application/json'
````

## GET A USER
Use the following `curl` command to retrieve a user:
````bash
$ curl --location --request GET "localhost:3000/user/$REST_API_USER_ID" --header 'Content-Type: application/json'
````

## PUT
`This service does not support PUT`

## PATCH
Use the following `curl` command to update the email address:
````bash
curl --location --request PATCH "localhost:3000/user/$REST_API_USER_ID" \
--header 'Content-Type: application/json' \
--data-raw '{
    "lastName": "Mattoso"
}'
````

## DELETE
`This service does not support DELETE`
