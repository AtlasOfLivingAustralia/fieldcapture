load('../../utils/reports.js');
var description = 'The core services annual report is being updated for the 21/22 financial year.  _Please do not commence annual reporting until the new report is ready for use._';
addDescriptionToMUReports('Core Services Annual Reporting', description);

description = 'The core services report is being updated for the 21/22 financial year.  _Please do not commence your July report until the new report is ready for use._';
addDescriptionToMUReports('Core Services Reporting', description);

description = 'The Annual Report is being updated for the 21/22 financial year. _Please do not commence annual reporting until the new report is ready for use._';
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