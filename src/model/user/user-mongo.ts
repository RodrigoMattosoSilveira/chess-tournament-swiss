/**
 * See Typescript With MongoDB and Node/Express,
 * https://medium.com/swlh/typescript-with-mongoose-and-node-express-24073d51d2ee
 *
 */
import mongoose from "mongoose";
import { UserDto} from "./user.interfaces";

/**
 * Extend the mongoose Document interface and use it as a Type on calls requiring the mongoose Document interface.
 *
 * merging interfaces: https://stackoverflow.com/questions/49723173/merge-two-interfaces
 */
// @ts-ignore
export interface IUserMongoDoc extends UserDto, mongoose.Document {
}

export interface IUserMongo extends mongoose.Model<IUserMongoDoc> {
	build(attr: UserDto): any
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: false
	},
	ratingState: {
		type: String,
		required: false
	},
	role: {
		type: String,
		required: false
	},
	state: {
		type: String,
		required: false
	}
})

userSchema.statics.build = (attr: UserDto) => {
	return new UserMongo(attr);
};
const UserMongo = mongoose.model<IUserMongoDoc, IUserMongo>("UserMongo", userSchema);

export{ UserMongo }
