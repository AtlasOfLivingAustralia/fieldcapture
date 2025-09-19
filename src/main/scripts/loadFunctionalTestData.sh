#!/bin/bash -v
echo "This script should be run from the project root directory"
if [ -z "$1" ]
  then
    echo "No data set name argument supplied"
    exit 1
fi

AUTH_OPTS=
if [ "$2" ]
  then
    AUTH_OPTS="-u $2 -p $3"
    echo "mongosh $DATABASE_NAME $AUTH_OPTS --eval " >>  /tmp/blah
fi

DATABASE_NAME=ecodata-functional-test
DATA_PATH=$1

cd $DATA_PATH
echo $PWD

mongosh $DATABASE_NAME $AUTH_OPTS --eval "db.dropDatabase()"

# loop over each time of collection and import it if it exists
for collection in project site activity output document program organisation score service report record userPermission; do
  if [ -f "$collection.json" ]; then
    mongoimport --db $DATABASE_NAME  $AUTH_OPTS --collection $collection --file "$collection.json"
  fi
done

mongosh $DATABASE_NAME $AUTH_OPTS loadDataSet.js