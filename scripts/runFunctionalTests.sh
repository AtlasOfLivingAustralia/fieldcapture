#!/bin/bash -v

MERIT_DIR=$PWD

GEB_ENV=$1
if [ -z $GEB_ENV ]; then
    GEB_ENV=chrome
fi

BRANCH=$3
if [ -z $BRANCH]; then
    BRANCH=dev
fi

ECODATA_LOCAL_DIR=$2
if [ -z $ECODATA_LOCAL_DIR ]; then
    ECODATA_LOCAL_DIR=../target/ecodata

    if [ ! -d $ECODATA_LOCAL_DIR ]; then
        cd ../target
        git clone https://github.com/AtlasOfLivingAustralia/ecodata.git
        cd ecodata
        git checkout $BRANCH
    else
        cd $ECODATA_LOCAL_DIR
        git pull
    fi
else
    cd $ECODATA_LOCAL_DIR
fi

echo "Dropping database"
mongo ecodata-functional-test --eval 'db.dropDatabase();'
mongo ecodata-functional-test --eval 'db.project.count();'

echo "Starting ecodata from $ECODATA_LOCAL_DIR"
grails -Dgrails.env=meritfunctionaltest run-app &

cd $MERIT_DIR/..

sleep 300
chmod u+x scripts/loadFunctionalTestData.sh

echo "Running functional tests"
grails test-app --echoOut -Dgrails.server.port.http=8087 -Dgrails.serverURL=http://devt.ala.org.au:8087/fieldcapture -Dgeb.env=$GEB_ENV functional:
RETURN_VALUE=$?

kill %1

exit $RETURN_VALUE
