import {DaoResult} from "../../common/generic.interfaces";

import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');
import {Err, Ok} from "space-monad";

import {ITournamentPatch, TOURNAMENT_PATCH_KEYS, ITournamentDto} from "./tournament.interfaces";
import {HttpResponseCode} from "../../contants/contants";
import {ITournamentMongoDoc, TournamentMongo} from "./tournament.mongo";
import {Many, One} from "@rmstek/rms-ts-monad";
import {TournamentUtil} from "./tournament.utils";

/**
 * Using the singleton pattern, this class will always provide the same instance.
 */
class TournamentDao {
	private static instance: TournamentDao;
	util: TournamentUtil = TournamentUtil.getInstance();

	constructor() {
		log('Created new instance of TournamentDao');
	}
	
	static getInstance(): TournamentDao {
		if (!TournamentDao.instance) {
			TournamentDao.instance = new TournamentDao();
			if (process.env.NODE_DATA === 'generated') {
				try {
					// const data = fs.readFileSync('./generated-data/tournament.generated.json', 'utf8')
					// TournamentDao.collection = JSON.parse(data)
					// console.log(`TournamentDao.getInstance - Read generated tournaments: ` + JSON.stringify(TournamentDao.collection));
				} catch (err) {
					console.error(err)
				}
			}
		}
		return TournamentDao.instance;
	}
	
	async create(entity: ITournamentDto): Promise< DaoResult<ITournamentDto, ITournamentDto[]>> {
		// console.log("TournamentDao/add: " + JSON.stringify(entity) +"\n");
		// Error handling
		// https://stackoverflow.com/questions/50905750/error-handling-in-async-await
		// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/

		let daoResult: DaoResult<ITournamentDto, ITournamentDto[]>;
		const documentMongo = TournamentMongo.build({...entity})
		try {
			let tournamentSaved = await documentMongo.save();
			let tournamentDto: ITournamentDto = this.util.fromMongoToDto(tournamentSaved);
			// 201 Created record
			daoResult = {code: HttpResponseCode.created, content: Ok(One(tournamentDto))};
		}
		catch (error)  {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err("TournamentDto /Create - Unable to create tournament entity")};
		}
		return daoResult;
	}
	
	async read(): Promise< DaoResult<ITournamentDto, ITournamentDto[]>> {
		let daoResult: DaoResult<ITournamentDto, ITournamentDto[]>;
		let entities: ITournamentDto[] = [];
		try {
			// Read all documents
			//TODO experiment with using lean to retrieve only the POJo document (ITournamentDto in this case);
			let documents: ITournamentMongoDoc[] = await TournamentMongo.find({}).exec();
			if (documents) {
				// @ts-ignore
				for (let document: ITournamentMongoDoc of documents) {
					// @ts-ignore
					let entity: ITournamentDto = this.util.fromMongoToDto(document);
					entities.push(entity);
				}
				// 200 Ok
				daoResult = {code: HttpResponseCode.ok, content: Ok(Many(entities))};
			}
			else {
				// 404 Not Found
				daoResult = {code: HttpResponseCode.not_found, content: Err("TournamentDto / Read - Did not find any tournaments")};
			}
		}
		catch (error) {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err("TournamentDto / Read - Unable to read tournament entities")};
		}
		return daoResult;
	}
	
	async readByEid(eid: string): Promise< DaoResult<ITournamentDto, ITournamentDto[]>> {
		let daoResult: DaoResult<ITournamentDto, ITournamentDto[]>;
		// Find one entity whose `id` is 'id', otherwise `null`
		try {
			//TODO experiment with using lean to retrieve only the POJo document (ITournamentDto in this case);
			let document = await TournamentMongo.findOne({eid: eid}).exec();
			if (document) {
				// Found, 200 = Ok
				let entity: ITournamentDto = this.util.fromMongoToDto(document);
				// 200 Ok
				daoResult = {code: HttpResponseCode.ok, content: Ok(One(entity))};
			}
			else {
				// 404 Not Found
				daoResult = {code: HttpResponseCode.not_found, content: Err(`TournamentDto / ReadById - Did not find tournament eid: ${eid}`)};
			}
		}
		catch (error) {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err(`TournamentDto / ReadById - Unable to read tournament eid: ${eid}`)};
		}
		return daoResult;
	}

	async patch(entity: ITournamentPatch): Promise< DaoResult<ITournamentDto, ITournamentDto[]>> {
		console.log(`TournamentDao/Patch entity: ${JSON.stringify(entity)}`);
		let daoResult: DaoResult<ITournamentDto, ITournamentDto[]>;

		let conditions = {eid: entity.eid};

		let update = {...entity}

		// Mongoose returns the updated document when new is true, and the POJO document when lean is present;
		let options = {new: true};

		let document = await TournamentMongo.findOneAndUpdate(conditions, update, {new: true, lean: true});
		if (document) {
			// 200 Ok
			let entity: ITournamentDto = this.util.fromMongoToDto(document);
			daoResult = {code: HttpResponseCode.ok, content: Ok(One(entity))};
		}
		else {
			// Did not find, 204 = No Content
			// 404 Not Found
			daoResult = {code: HttpResponseCode.not_found, content: Err(`TournamentDto / Patch - Did not find tournament id ${entity.eid}, not patched`)};
		}
		return daoResult;
	}

	async readByName(name: string) {
		let daoResult: DaoResult<ITournamentDto, ITournamentDto[]>;
		// Find one entity whose `name` is 'name', otherwise `null`
		try {
			let document = await TournamentMongo.findOne({name: name}).exec();
			if (document) {
				// Found, 200 = Ok
				let entity: ITournamentDto = this.util.fromMongoToDto(document);
				// 200 Ok
				daoResult = {code: HttpResponseCode.ok, content: Ok(One(entity))};
			}
			else {
				// 404 Not Found
				daoResult = {code: HttpResponseCode.not_found, content: Err(`TournamentDto / readByName - Did not find tournament name: ${name}`)};
			}
		}
		catch (error) {
			// 500 Internal Server Error
			daoResult = {code: HttpResponseCode.internal_server_error, content: Err(`TournamentDto / readByName - Unable to read tournament name: ${name}`)};
		}
		return daoResult;
	}
}

export default TournamentDao.getInstance();
