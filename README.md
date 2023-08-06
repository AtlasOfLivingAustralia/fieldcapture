### MERIT   
## Build status 
Master: [![Build Status](https://travis-ci.com/AtlasOfLivingAustralia/fieldcapture.svg?branch=master)](https://travis-ci.com/AtlasOfLivingAustralia/fieldcapture)
Dev: [![Build Status](https://travis-ci.com/AtlasOfLivingAustralia/fieldcapture.svg?branch=dev)](https://travis-ci.com/AtlasOfLivingAustralia/fieldcapture)
Grails 4: [![Build Status](https://travis-ci.com/AtlasOfLivingAustralia/fieldcapture.svg?branch=feature/grails4)](https://travis-ci.com/AtlasOfLivingAustralia/fieldcapture)

## About
MERIT is a web application designed to collect and store planning, monitoring and reporting data associated with natural resource management projects.
It is currently in use by the Australian Government Department of the environment and energy. 

## General Information
### Technologies
* Grails framework 4.0.10
* Knockout JS
* Bootstap 4

## Setup
* Clone the repository to your development machine.
* Create local directories: 
```
/data/fieldcapture/config
/data/fieldcapture/images
```
* The application expects any external configuration file to be located in the path below.  An example configuration can be found at: https://github.com/AtlasOfLivingAustralia/ala-install/blob/master/ansible/inventories/vagrant/merit-vagrant
```
/data/fieldcapture/config/fieldcapture-config.properties
```
This configuration file largely specifies URLs to MERIT dependencies.  See https://github.com/AtlasOfLivingAustralia/fieldcapture/wiki/MERIT-Dependencies for information about these.
Note that you will need to obtain an ALA API key to use ALA services and a Google Maps API key and specify them in this file.

* Install npm and nodejs (see https://www.npmjs.com/get-npm)
* Install the node dependencies for MERIT.  Note these are currently only used for testing.

```
npm install
npm install -g karma
```

## Testing
* To run the grails unit tests with clover test coverage, use:
```
./gradlew test -PenableClover=true
```

* Javascript user tests are run using npm/karma.
```
npm test
```
Or, to run the tests in a debugging environment using chrome:
```
npm run-script debug
```
Or, directly using karma:
```
node_modules/karma/bin/karma start karma.conf.js
```

(if you installed karma globally you won't need the full path)


## Running
MERIT depends on a running instance of [ecodata](https://github.com/AtlasOfLivingAustralia/ecodata) and CAS so ensure these dependencies are running and configured correctly in fieldcapture-config.properties.
```
./gradlew bootRun
```

To run MERIT with support for hot-reloading of changes to the ecodata-client-plugin, clone the ecodata-client-plugin repository into the same parent folder as the fieldcapture project.
Run MERIT with additonal parameters:
```
./gradlew :bootRun -Dgrails.run.active=true -Pinplace=true
```

Note the leading colon before the bootRun task - this is required as when inplace=true gradle is configured in a multi-project build configuration.

# MacOS Catalina
(This is only relevant to versions of MERIT prior to 3.0.  From 3.0, MERIT will look for development config in $HOME/data/)
if you getting this error in MacOS
```
unable to create directory data/fieldcature/ehcache
``` 
You can use the file /etc/synthetic.conf to map your old folder to a new virtual folder on the root directory. If the file doesn't exists, just create it with sudo :
```
sudo nano /etc/synthetic.conf
Add this line in the synthetic.conf
data    /User/directory/data/
```
You must have only one tab character only between data and /User/directory/data/


Note the development configuration assumes MERIT is running on port 8087.  This is because is it usually paried with ecodata, which is running on port 8080.

