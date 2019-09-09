#!/usr/bin/env bash -v
echo "This script should be run from the project root directory"
if [ -z "$1" ]
  then
    echo "No data set name argument supplied"
    exit 1
fi

DATABASE_NAME=ecodata-functional-test
DATA_PATH=$1

#cd $DATA_PATH
echo $PWD

mongo $DATABASE_NAME --eval "db.dropDatabase()" >> /tmp/mongo1.txt
mongo $DATABASE_NAME ${DATA_PATH}loadDataSet.js >> /tmp/mongo2.txt


