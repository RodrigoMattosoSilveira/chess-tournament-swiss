import {IUserMongo, UserMongo} from './user-mongo'
import * as testDb from '../../utils/test-db';
import {UserDto} from "./user.model";

beforeAll(async () => {
	await testDb.connect()
});

afterEach(async () => {
	await testDb.clearDatabase()
});

afterAll(async () => {
	await testDb.closeDatabase()
});
describe('User Entity MongoDB', () => {
		let entityDto: UserDto = {
		id: "somecrazynumber",
		email: "Paul.Roberts@yahoo.com",
		password: "$dfg&*mns12PP",
		firstName: "Paul",
		lastName: "Roberts",
		permissionLevel: 0,
		rating: 1234
	}
	
	it('User MongoDB canonical test', async done => {
		expect(1 + 1).toEqual(2);
		done();
	});
	
	describe('post test', () => {
		it('can be created correctly', async () => {
			expect.assertions(3)
			// create new post model instance
			const userMongo = UserMongo.build({...entityDto})
			// set some test properties
			await userMongo.save()
			// find inserted post by title
			const postInDb = await UserMongo.findOne({id: entityDto.id}).exec()
			console.log('Post document from memory-db', postInDb)
			// check that title is expected
			expect(postInDb).toBeTruthy();
			//@ts-ignore
			expect(postInDb.email).toEqual(entityDto.email)
			// check that content is expected
			//@ts-ignore
			expect(postInDb.firstName).toEqual(entityDto.firstName)
		});
	});
});
