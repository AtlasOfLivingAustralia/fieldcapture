#!/bin/bash
mongo -u ecodata -p "$1" ecodata removeDataSetAttributes.js
mongo -u ecodata -p "$1" ecodata insertParatooProtocolConfig.js
mongo -u ecodata -p "$1" ecodata updateNhtProgramConfig.js
mongo -u ecodata -p "$1" ecodata fixSiteExternalIds.js
mongo -u ecodata -p "$1" ecodata insertRdpDeclarationText.js
