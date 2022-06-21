load('../../utils/reports.js');
var description = null;
addDescriptionToMUReports('Core Services Annual Reporting', description);

var programs = [
    'Departmental',
    'NHT Emerging Priorities',
    'Direct source procurement',
    'Flood Recovery Tranche 1',
    'Pest Mitigation and Habitat Protection',
    'Post-fire monitoring',
    'Regional Fund - Co-design Koalas',
    'Regional Fund - Co-design NRMs',
    'Strategic and Multi-regional - Koalas',
    'Strategic and Multi-regional projects - NRM',
    'Regional Land Partnerships'];
addDescriptionToProgramReports('Annual Progress Reporting', description, programs);