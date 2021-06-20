// a generic type to capture the result of a DAO read operation, where
import {Result} from "space-monad";
import {UserDto} from "../model/user/user.interfaces";

export type OneOrMany<Type> = Type | Type[];

export type DaoError = {
	code: number,
	content: string
}