/**
 * See Typescript With MongoDB and Node/Express,
 * https://medium.com/swlh/typescript-with-mongoose-and-node-express-24073d51d2ee
 *
 */
import mongoose from "mongoose";
import { ITournamentDto } from "./tournament.interfaces";

/**
 * Extend the mongoose Document interface and use it as a Type on calls requiring the mongoose Document interface.
 *
 * merging interfaces: https://stackoverflow.com/questions/49723173/merge-two-interfaces
 */
export interface ITournamentMongoDoc extends ITournamentDto, mongoose.Document {}
// export type ITournamentMongoDoc = ITournamentDto &  mongoose.Document;

export interface ITournamentMongo extends mongoose.Model<ITournamentMongoDoc> {
	build(attr: ITournamentDto): any
}

const tournamentSchema = new mongoose.Schema({
	eid: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: false
	},
	country: {
		type: String,
		required: false
	},
	year: {
		type: Number,
		required: false
	},
	rounds: {
		type: Number,
		required: false
	},
	maxPlayers: {
		type: Number,
		required: false
	},
	minRate: {
		type: Number,
		required: false
	},
	maxRate: {
		type: Number,
		required: false
	},
	type: {
		type: String,
		required: false
	},
	players: {
		type: [String],
		required: true
	},
	state: {
		type: String,
		required: false
	},
	winPoints: {
		type: Number,
		required: false
	},
	tiePoints: {
		type: Number,
		required: false
	},
	scheduledStartDate: {
		type: Number,
		required: false
	},
	scheduledEndDate: {
		type: Number,
		required: false
	},
	actualStartDate: {
		type: Number,
		required: false
	},
	actualEndDate: {
		type: Number,
		required: false
	},
})

tournamentSchema.statics.build = (attr: ITournamentDto) => {
	return new TournamentMongo(attr);
};
const TournamentMongo = mongoose.model<ITournamentMongoDoc, ITournamentMongo>("Tournament", tournamentSchema);

export{ TournamentMongo }
