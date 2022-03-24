#!/bin/bash
mongo -u ecodata -p "$1" ecodata createProgramsForGrantsHubImport.js
mongo -u ecodata -p "$1" ecodata fixIncorrectOrganisationIds.js