import {OneOrMany} from "../../common/generic.interfaces";

/**
 * This is the canonical user entity interface.
 * - email: must be a valid email string and must be unique;
 * - firstName: must be a string;
 * - id: a unique string generated by the service when creating an entity, (npm shortid);
 * - lastName: must be a string;
 * - password: length must be between 6 and 12 characters, and be strong (npm owasp-password-strength-test)
 * - permissionLevel: a number, between 0 and 10, generated by the service, 0, when creating an entity;
 * - rating: number: a number, between 1000 and 3000 generated by the service, 1000, when creating an entity;
 * - ratingState: a string, provisional/effective, generated by the service when creating an entity, "provisional"; the
 *   system updates it to "effective" after five games.
 * - state: a string, "active"/"inactive" generated by the service, "active", when creating an entity;
 */
export interface UserDto {
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	password: string;
	role: string;
	rating: number;
	ratingState: string;
	state: string;
}

/**
 *  Interface used to create an user entity. Note that the remaining UserDto attributes are generated by the service
 *  when creating an entity;
 *
 *  The CREATE API returns a UserDto for the new entity;
 */
export interface IUserCreate {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}
export const requiredCreateAttributes = ["email", "firstName", "lastName", "password"]

/**
 *  Interface used to create a user entity. Note that the remaining attributes are generated by the service when
 *  patching an entity;
 *
 *  The PATCH API returns a UserDto for the updated entity;
 */
export interface IUserPatch {
	email?: string;
	firstName?: string;
	lastName?: string;
	password?: string;
	role?: string;
	rating?: number;
	ratingState?: string;
	state?: string;
}
export const patchableAttributes = ["email", "firstName", "lastName", "password", "role", "rating", "ratingState", "state"]

/**
 *  Interface representing the object returned from the DAO layer. Only one of the two can be present.
 *
 */
export interface IUserResponse {
	result?: OneOrMany<UserDto>;
	error?: any;
}

export type EmailValidationCodeT = number;
