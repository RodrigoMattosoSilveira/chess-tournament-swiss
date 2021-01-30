/**
 * Here, we are importing the CommonRoutesConfig class and extending it to our new class, called UsersRoutes. With the
 * constructor, we send the app (the main express.Application object) and the name UsersRoutes to CommonRoutesConfig’s
 * constructor.
 *
 * This example is quite simple, but when scaling to create several route files, this will help us avoid duplicate code.
 *
 * Suppose we would want to add new features in this file, such as logging. We could add the necessary field to the
 * CommonRoutesConfig class, and then all the routes that extend CommonRoutesConfig will have access to it.
 */
import express from 'express';
export abstract class CommonRoutesConfig {
	app: express.Application;
	name: string;
	
	protected constructor(app: express.Application, name: string) {
		this.app = app;
		this.name = name;
		this.configureRoutes();
	}
	getName() {
		return this.name;
	}
	abstract configureRoutes(): express.Application;
}
