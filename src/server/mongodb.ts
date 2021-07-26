import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

abstract class MongoDb {
    protected constructor (protected uri: string, protected options: any ) {}

    abstract connect = async (): Promise<void> => {};
    abstract close = async (): Promise<void> => {};
    abstract clearDb = async (): Promise<void> => {};
    abstract clearCollection = async (collection: any): Promise<void> => { await collection.deleteMany({}); };
}

export class MongoAtlas extends MongoDb {
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
    clearDb = async (): Promise<void> => {
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

export class MongoInMemory extends MongoDb {
    constructor (uri: string, options: any ) {
        super (uri, options);
    }
    protected mongodb: any;
    protected uri: string = "";
    connect = async (): Promise<void> => {
        this.mongodb = await new MongoMemoryServer();
        this. uri = await this.mongodb.getUri();
        await mongoose.connect(this.uri, this.options);
    };
    close = async (): Promise<void> => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongodb.stop();
    }
    clearDb = async (): Promise<void> => {
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