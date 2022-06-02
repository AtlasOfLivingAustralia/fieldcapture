var programsToChange = [
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
var activityTypes = ['RLP Output Report'];
var rejectionCategories = ['Services delivered don’t match invoice submitted', 'Services delivered don’t align with activities described in the MERI plan', 'Quality Assurance Check found insufficient evidence of service delivery', 'Other (PM to describe)'];

for (var i=0; i<programsToChange.length; i++) {
    var program = db.program.findOne({name:programsToChange[i]});

    if (!program) {
        throw 'Cannot find program: '+programsToChange[i];
    }
}

for (var i=0; i<programsToChange.length; i++) {
    var program = db.program.findOne({name:programsToChange[i]});
    var reports = program.config.projectReports;
    var found = false;
    for (var j=0; j<reports.length; j++) {
        if (activityTypes.indexOf(reports[j].activityType) >= 0) {
            reports[j].rejectionReasonCategoryOptions = rejectionCategories;
            print("updating report config for "+programsToChange[i]);
            found = true;
        }
    }
    if (found) {
        db.program.save(program);
    }
    else {
        print("No matching reports found for program "+programsToChange[i]);
    }

}
