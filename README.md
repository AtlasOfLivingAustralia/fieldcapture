### MERIT   
## Build status [![Build Status](https://travis-ci.org/AtlasOfLivingAustralia/fieldcapture.svg?branch=grails-2.4)](https://travis-ci.org/AtlasOfLivingAustralia/fieldcapture)
## About
MERIT is a web application designed to collect and store planning, monitoring and reporting data associated with natural resource management projects.
It is currently in use by the Australian Government Department of the environment and energy. 

## General Information
### Technologies
* Grails framework 2.5.6
* Knockout JS
* Bootstap 2/4

## Setup
* Clone the repository to your development machine.
* Create local directories: 
```
/data/fieldcapture/config
/data/fieldcapture/images
```
* The application expects any external configuration file to be located in the path below.  An example configuration can be found at: https://github.com/AtlasOfLivingAustralia/ala-install/blob/master/ansible/inventories/vagrant/merit-vagrant
```
/data/fieldcapture/config/fielcapture-config.properties
```
This configuration file largely specifies URLs to MERIT dependencies.  See https://github.com/AtlasOfLivingAustralia/fieldcapture/wiki/MERIT-Dependencies for information about these.
Note that you will need to obtain an ALA API key to use ALA services and a Google Maps API key and specify them in this file.

* Install npm (see https://www.npmjs.com/get-npm)
* Install the node dependencies for MERIT.  Note these are currently only used for testing.

```
npm install
npm install -g karma
```

## Testing
* To run the grails unit tests, use:
```
grails test-app
```

* Javascript user tests are run using npm/karma.
```
node_modules/karma/bin/karma start karma.conf.js
```
(if you installed karma globally you won't need the full path)


## Running
MERIT depends on a running instance of [ecodata](https://github.com/AtlasOfLivingAustralia/ecodata) and CAS so ensure these dependencies are running and configured correctly in fieldcapture-config.properties.
```
grails run-app -Dgrails.server.port=8087
```
Note the development configuration assumes MERIT is running on port 8087.  This is because is it usually paried with ecodata, which is running on port 8080.

