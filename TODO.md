# `Migrate the tournament entity to use mongo/monads` milestone todo list
* Refactor `DAO` to use MongoDB and return a [Result](https://www.npmjs.com/package/space-monad) monad, using the the [OneMany](https://github.com/RodrigoMattosoSilveira/rms-ts-monads) monad, as necessary;
* Add `tournament.dao` tests using JEST.MOCK; re-factor `user.dao` to adopt it;
* Refactor `Service` / `Controller` to use the [Result](https://www.npmjs.com/package/space-monad) and [OneMany](https://github.com/RodrigoMattosoSilveira/rms-ts-monads) Monads;
* Add `tournament.dao` tests using JEST.MOCK; re-factor `user.dao` to adopt it;
* Refactor `Middleware` to use the [keys](https://www.npmjs.com/package/ts-transformer-keys) and the utilities that use hard coded values;
* Write `Middleware` unit tests;
* Refactor `Utils` to be a simple module that exports its functions
* Move the node scripts, `create-users`, `create-tournament` to the application; write tests to validate them;