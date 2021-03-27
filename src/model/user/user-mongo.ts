/**
 * See Typescript With MongoDB and Node/Express,
 * https://medium.com/swlh/typescript-with-mongoose-and-node-express-24073d51d2ee
 *
 */
import mongoose from "mongoose";
import { UserDto} from "./user.model";

/**
 * Extend the mongoose Document interface and use it as a Type on calls requiring the mongoose Document interface.
 *
 * merging interfaces: https://stackoverflow.com/questions/49723173/merge-two-interfaces
 */
// @ts-ignore
interface IUserMongoDoc extends UserDto, mongoose.Document {
}

export interface IUserMongo extends mongoose.Model<IUserMongoDoc> {
	build(attr: UserDto): any
}

const userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: false
	},
	lastName: {
		type: String,
		required: false
	},
	permissionLevel: {
		type: Number,
		required: false
	},
	rating: {
		type: Number,
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
