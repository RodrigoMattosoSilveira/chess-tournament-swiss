// a generic type to capture the result of a DAO read operation, where
export type OneOrMany<Type> = Type | Type[];

// A generic type to capture the result of a DAO operation
export type DAOResponse<Type> = {
	result?: OneOrMany<Type>;
	error?: any
}

export type DAOError = {
	code: number,
	content: string
}
