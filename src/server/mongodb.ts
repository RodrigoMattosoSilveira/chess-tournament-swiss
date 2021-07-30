import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * An abstract class describing the MongoDB operations
 */
export abstract class AMongoDb {
    protected constructor (protected uri: string, protected options: any ) {}

    abstract connect = async (): Promise<void> => {};
    abstract close = async (): Promise<void> => {};
    abstract clear = async (): Promise<void> => {};
    abstract clearCollection = async (collection: any): Promise<void> => { await collection.deleteMany({}); };
}

/**
 * A AMongoDb instance describing the operations to manage an MongoDB Atlas instance
 */
export class MongoAtlas extends AMongoDb {
    constructor (uri: string, options: any ) {
        super (uri, options);
    }
    connect = async (): Promise<void> => {
        mongoose.set("useFindAndModify", false)
        mongoose
            .connect(this.uri, this.options)
            .then(() => {
                console.log(`MongoDB Atlas server running: ${this.uri}`);
             })
            .catch(error => {
                console.log(`Unable to connect to MongoDB Atlas server ${JSON.stringify(error)}`);
                throw error
            })
    };
    close = async (): Promise<void> => {
        await mongoose.connection.close();
    }
    clear = async (): Promise<void> => {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await this.clearCollection(collection)
        }
    }
    clearCollection = async (collection: any): Promise<void> => {
        await collection.deleteMany({});
    }
}

/**
 * A AMongoDb instance describing the operations to manage an In Memory MongoDB instance
 */
export class MongoInMemory extends AMongoDb {
    constructor (uri: string, options: any ) {
        super (uri, options);
    }
    protected mongodb: any;
    protected uri: string = "";
    connect = async (): Promise<void> => {
        this.mongodb = await new MongoMemoryServer();
        this. uri = await this.mongodb.getUri();
        let state = await mongoose.connect(this.uri, this.options);
    };
    close = async (): Promise<void> => {
        // await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongodb.stop();
    }
    clear = async (): Promise<void> => {
        const collections: { [p: string]: mongoose.Collection } = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await this.clearCollection(collection)
        }
    }
    clearCollection = async (collection: mongoose.Collection): Promise<void> => {
        await collection.deleteMany({});
    }
}

/**
 * A AMongoDb instance describing an non existing database; used for unit tests
 */
export class MongoNone extends AMongoDb {
    constructor(uri: string, options: any) {
        super(uri, options);
    }

    protected mongodb: any;
    protected uri: string = "";
    connect = async (): Promise<void> => {};
    close = async (): Promise<void> => {}
    clear = async (): Promise<void> => {}
    clearCollection = async (): Promise<void> => {}
}