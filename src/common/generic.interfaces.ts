import { Result } from 'space-monad';
import { OneMany } from '@rmstek/rms-ts-monad';

export type DaoError = {
	code: number,
	content: string
}

/**
 *  Interface representing the object returned from the DAO layer. Only one of the two can be present.
 *
 */
export type DaoResult<O, M> = {
	code: number,
	content: Result<string, OneMany<O,M>>
}