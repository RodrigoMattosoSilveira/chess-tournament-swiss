# tournament
Model a site tournament

#curl
See this folder's `curl.md` file for details.

#Model
See this folder's `tournament.interfaces.ts` file for details.

# Plan of Action
- Re-factor tournament documentation (#22):
    - Write a `CURL.m`d file;
    - Update the `README.md` file;
- Isolate all validation methods (#23):
    - Write the `tournament.utils.ts` file with validation functions;
    - re-factor the `tournament.route.ts` file to reflect the validation functions;
    - Write the `tournament.middleware.test.ts` file with validation functions' unit tests;
- Merge tournament.models.ts into tournament.interfaces.ts` (#24):
    - Merge the `tournament.models.ts file` into `tournament.interfaces.ts`, and delete it;
- Re-factor the tournament entity to use monads/try catch (#25):
    - Re-factor the `tournament.dao.ts` file to use `monads & try/catch`;
    - the same for the `service` and `controller` files
    - Write the `tournament.dao.test.ts `file to validate `tournament.dao.ts`
- Re-factor the tournament.dao.ts file to use mongo (#26);
    - create the `tournament.mongo.ts` file
    - Re-factor the `tournament.dao.test.ts` file, as necessary