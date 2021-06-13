import { Result } from 'space-monad';
import {DAOError} from "../../common/generic.interfaces";

export interface UserDto {
	id: string;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	permissionLevel?: number;
	rating?: number;
	state?: string; // active* or inactive
}

export type UserDaoResult = Result<DAOError, UserDto>