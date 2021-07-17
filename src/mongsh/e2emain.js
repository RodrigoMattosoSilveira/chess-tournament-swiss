console.log("Setting up e2e database")

conn = Mongo("mongodb+srv://systemAdmin:hUr9bvrr4AQiDJf@rms-mongo-cluster-chess.z4pdw.mongodb.net");

// Drop the database
db = conn.getDB("swiss_pairing_e2e");
db.dropDatabase();

// Create a collection; Mongo creates the db and collection
db["users"].insertOne(
    {
        email: "test@email.com",
        firstName: "John",
        lastName: "Doe",
        password: "very easy"
    }
)