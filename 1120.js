const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');

const DB_CONN_STRING = "mongodb://localhost:27017/";
const DB_NAME = "411630758";
const STDNTS_COLLECTION_NAME = "studentslist";

const client = new MongoClient(DB_CONN_STRING);

async function showAllStudents() {
    const collection = client.db(DB_NAME).collection(STDNTS_COLLECTION_NAME);
    const students = await collection.find().toArray();
    console.log("All students:", students);
}

async function insertStudentsFromCSV(csvFilePath) {
    const collection = client.db(DB_NAME).collection(STDNTS_COLLECTION_NAME);
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    const insertResult = await collection.insertMany(results);
                    console.log(`Inserted ${insertResult.insertedCount} students`);
                    resolve(insertResult);
                } catch (error) {
                    console.error("Error inserting data:", error);
                    reject(error);
                }
            });
    });
}


(async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        await insertStudentsFromCSV('studentslist.csv');
        await showAllStudents();

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed.");
    }
})();
