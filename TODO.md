# `Migrate the tournament entity to use mongo/monads` milestone todo list
* Write an `user` `e-2-e` test, using URLs;
* Rename `tournament.models.ts` to `tournament.interfaces.ts`;
* Refactor `tournament` `DAO` to use MongoDB and return a [Result](https://www.npmjs.com/package/space-monad) monad, using the the [OneMany](https://github.com/RodrigoMattosoSilveira/rms-ts-monads) monad, as necessary;
* Refactor `Service` / `Controller` to use the [Result](https://www.npmjs.com/package/space-monad) and [OneMany](https://github.com/RodrigoMattosoSilveira/rms-ts-monads) Monads;
* Add `tournament.dao` unit tests, see `user.mongo.test.ts` for reference;
* Refactor `Middleware` to use the [keys](https://www.npmjs.com/package/ts-transformer-keys) and the utilities that use hard coded values;
* Isolate `tournament` validation methods; see `utils` and `user.utils`;
* Write `Middleware` unit tests;
* Refactor `Utils` to be a simple module that exports its functions
* Move the node scripts, `create-users`, `create-tournament` to the application; write tests to validate them;