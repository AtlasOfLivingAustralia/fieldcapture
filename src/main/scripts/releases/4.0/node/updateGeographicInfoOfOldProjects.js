#!/usr/bin/env node
// npm install mongodb yargs csv-parser
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const outputFile = 'geoInfoOutput.csv'; // Replace with your desired output CSV file path
const host = 'localhost';
const collectionName = 'project';
// Parse command-line arguments
const argv = yargs(hideBin(process.argv)).argv;
const password = argv.password;
const username = argv.username;
const databaseName = argv.database || "ecodata";
const file = argv.file || "geographicInfo.csv";
let uri = `mongodb://${username}:${password}@${host}/${databaseName}?retryWrites=true&w=majority`;

if (!password || !username) {
    uri = `mongodb://${host}:27017/${databaseName}?retryWrites=true&w=majority`;
}

console.log("Connecting to MongoDB...");
console.log(uri);
const client = new MongoClient(uri, { });
console.log("Connected to MongoDB");

async function updateCollection() {
    var rows = []
    try {
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', async (row) => {
                rows.push(row);
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');
                updateProjects(rows);
            });
    } catch (error) {
        console.error(error);
    }
}

async function updateProjects(rows) {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    let count = 1, total = rows.length, errors = 0, duplicateCount = 0,
        projectNotFoundMessages = [], geographicInfoMessages = [], duplicateProjectMessages = [],
        project;
    for (const row of rows) {
        project = null;
        count ++;
        let filters = [];
        if (row.PROJECT_ID) {
            project = await collection.findOne({ projectId: row.PROJECT_ID, status: { $ne: "deleted" } });
            if(project) {
                console.log('project found with id');
            }
        }
        // console.log('project id');
        if (!project && row.EXTERNAL_ID && row.EXTERNAL_ID !== "To be advised") {
            filters = []
            filters.push( { externalId: row.EXTERNAL_ID } );
            filters.push( { "externalIds.externalId": row.EXTERNAL_ID } );
            project = await collection.findOne({ $or: filters, status: { $ne: "deleted" }});
            if(project) {
                console.log('project found with external id');
            }
        }
        // console.log('external id');
        if(!project && row.VARIOUS_ID) {
            filters = []
            filters.push( { externalId: row.VARIOUS_ID } );
            filters.push( { "externalIds.externalId": row.VARIOUS_ID } );
            let projectCount = await collection.countDocuments({$or: filters, status: { $ne: "deleted" }});
            if (projectCount === 1) {
                project = await collection.findOne({$or: filters, status: { $ne: "deleted" }});
                if(project) {
                    console.log('project found with various id');
                }
            }
            else if (projectCount > 1) {
                duplicateProjectMessages.push(`Multiple projects found for row ${count} with name ${row.PROJECT_NAME} and query used ${JSON.stringify(filters)}`);
                duplicateCount++;
                continue;
            }
        }

        if (!project) {
            projectNotFoundMessages.push(`No project found for row ${count} with name ${row.PROJECT_NAME} and query used ${JSON.stringify(filters)}`);
            errors++;
            continue;
        }

        // console.log('found a project');

        var sites = await database.collection('site').find({projects: project.projectId});
        var geographicInfo =  createGeographicInfoObject(row, sites);
        if (project.geographicInfo) {
            if (areObjectsDifferent(geographicInfo, project.geographicInfo)) {
                geographicInfoMessages.push("************************************");
                geographicInfoMessages.push(`Geographic info is different for project ${project.name} ${project.projectId};\nrow number ${count};\nnew geo info - \n${JSON.stringify(geographicInfo)};\nexisting info - \n${JSON.stringify(project.geographicInfo)};`);
                continue;
            }
        }

        await collection.updateOne({projectId: project.projectId}, {$set: {geographicInfo: geographicInfo} }, { upsert: false });
    }


    var content = `\n---------------------------------\n${duplicateProjectMessages.join("\n")}`;
    fs.writeFileSync(outputFile, content);
    content = `\n---------------------------------\n${projectNotFoundMessages.join("\n")}`;
    fs.appendFileSync(outputFile, content);
    content = `\n---------------------------------\n${geographicInfoMessages.join("\n")}`;
    fs.appendFileSync(outputFile, content);
    content = `Projects not found ${errors} out of ${total}. Duplicate projects found ${duplicateCount} out of ${total} rows processed.`;
    fs.appendFileSync(outputFile, content);
    console.log("completed");
    client.close();
}

function createGeographicInfoObject (row, sites) {
    return  {
        "nationwide": sites.length === 0,
        "otherElectorates": row.OTHER_ELECT_DIV ? (row.OTHER_ELECT_DIV).split(",") : [],
        "otherStates": row.OTHER_STATE ? (row.OTHER_STATE).split(",") : [],
        "primaryElectorate": row.PRIMARY_ELECT_DIV || "",
        "primaryState": row.PRIMARY_STATE || ""
    }
}


function areObjectsDifferent(obj1, obj2) {
    // Check if both are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return true;
    }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if they have the same number of keys
    if (keys1.length !== keys2.length) {
        return true;
    }

    // Check if all keys and values are the same
    for (let key of keys1) {
        // Check if the key exists in both objects
        if (!obj2.hasOwnProperty(key)) {
            return true;
        }

        // Check if the values are objects themselves, and do a deep comparison if they are
        let val1 = obj1[key];
        let val2 = obj2[key];

        const areBothObjects = typeof val1 === 'object' && typeof val2 === 'object';
        if (areBothObjects && areObjectsDifferent(val1, val2)) {
            return true;
        }

        // Check if the values are different
        if(typeof val1 === 'string') {
            val1 = val1.trim().toLowerCase();
        }
        if (typeof val2 === 'string') {
            val2 = val2.trim().toLowerCase();
        }
        if (!areBothObjects && val1 !== val2) {
            return true;
        }
    }

    // If no differences are found
    return false;
}


updateCollection();
