#!/bin/bash -v

MERIT_DIR=$PWD

GEB_ENV=$1
if [ -z $GEB_ENV ]; then
    GEB_ENV=chromeHeadless
fi

BRANCH=$3
if [ -z $BRANCH ]; then
    BRANCH=dev
fi

ECODATA_LOCAL_DIR=$2
if [ -z $ECODATA_LOCAL_DIR ]; then
    ECODATA_LOCAL_DIR=/tmp/ecodata
fi

if [ ! -d $ECODATA_LOCAL_DIR ]; then
    cd /tmp
    git clone https://github.com/AtlasOfLivingAustralia/ecodata.git
    cd ecodata
    git checkout $BRANCH
    echo "Cloned ecodata $BRANCH into /tmp/ecodata"
else
    cd $ECODATA_LOCAL_DIR
    git checkout $BRANCH
    git pull
    echo "Updated ecodata $BRANCH in /tmp/ecodata"
fi

echo "Dropping database"
mongosh ecodata-functional-test --eval 'db.dropDatabase();'
mongosh ecodata-functional-test --eval 'db.project.count();'



cd $MERIT_DIR
GRADLE_OPTS="-Xmx1g" ./gradlew bootRun "-Dorg.gradle.jvmargs=-Xmx1g" -Dgrails.env=test -PstartWiremock=true -Dgrails.server.port.http=8087 &
sleep 180

cd $ECODATA_LOCAL_DIR
echo "Starting ecodata from `pwd`"
ls -la
GRADLE_OPTS="-Xmx1g" ./gradlew bootRun "-Dorg.gradle.jvmargs=-Xmx1g" -Dgrails.env=meritfunctionaltest &
sleep 360


cd $MERIT_DIR
chmod u+x src/main/scripts/loadFunctionalTestData.sh

echo "Running functional tests"
GRADLE_OPTS="-Xmx1g" ./gradlew integrationTest "-Dorg.gradle.jvmargs=-Xmx1g" --stacktrace -Dgeb.env=$GEB_ENV -Dwebdriver.chrome.driver=/usr/bin/chromedriver

RETURN_VALUE=$?

kill %2
kill %1

exit $RETURN_VALUE
