#!/bin/bash
cd ../2.11/legacy
mongosh -u ecodata -p "$1" ecodata addCumberlandPlainProgramToDatabase.js
mongosh -u ecodata -p "$1" ecodata addNationalLandcareProgramToDatabase.js
mongosh -u ecodata -p "$1" ecodata addGreenArmyProgramToDatabase.js
mongosh -u ecodata -p "$1" ecodata addCaringForOurCountry2ProgramToDatabase.js
mongosh -u ecodata -p "$1" ecodata addReef2050PlanProgramToDatabase.js
mongosh -u ecodata -p "$1" ecodata addBiodiversityFundProgramToDatabase.js

cd ../3.0
mongo -u ecodata -p "$1" ecodata configureNewProgram.js
mongo -u ecodata -p "$1" ecodata configureOrganisationReports.js
