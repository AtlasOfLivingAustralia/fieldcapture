var managementUnits = db.managementUnit.find({status:{$ne:'deleted'}});

while (managementUnits.hasNext()) {
    var mu = managementUnits.next();

    var modified = false;
    if (mu.config && mu.config.projectReports) {
        var projectReports = mu.config.projectReports;
        for (var i=0; i<projectReports.length; i++) {
            if (projectReports[i].activityType == "RLP Output Report") {
                if (projectReports[i].reportingPeriodInMonths == 6) {
                    projectReports[i].label = 'Semester';
                    modified = true;
                }
                else if (projectReports[i].reportingPeriodInMonths == 3) {
                    projectReports[i].label = 'Quarter'
                    modified = true;
                }
                else {
                    print("No reportingPeriod in months for MU "+mu.name+" period="+projectReports[i].reportingPeriodInMonths);
                }

            }
        }
    }

    if (mu.config && mu.config.managementUnitReports) {
        var muReports = mu.config.managementUnitReports;
        for (var i=0; i<muReports.length; i++) {
            if (muReports[i].activityType == "RLP Core Services report") {
                if (muReports[i].reportingPeriodInMonths == 1) {
                    muReports[i].label = 'Monthly';
                    modified = true;
                }
                else if (muReports[i].reportingPeriodInMonths == 2) {
                    muReports[i].label = 'Bi-monthly'
                    modified = true;
                }
                else if (muReports[i].reportingPeriodInMonths == 3) {
                    if (muReports[i].firstReportingPeriodEnd == '2018-09-30T14:00:00Z') {
                        muReports[i].label = 'Quarterly - Group A'
                        modified = true;
                    }
                    else if (muReports[i].firstReportingPeriodEnd == '2018-08-31T14:00:00Z') {
                        muReports[i].label = 'Quarterly - Group B'
                        modified = true;
                    }
                    else {
                        print("No matchign end date for MU "+mu.name+" period="+muReports[i].firstReportingPeriodEnd);
                    }
                }
                else {
                    print("No reportingPeriod in months for MU "+mu.name+" period="+muReports[i].reportingPeriodInMonths);
                }

            }
        }
    }
    if (modified) {
        db.managementUnit.save(mu);
        print("Updating mu: "+mu.name);
    }
    else {
        print("Not updating mu: "+mu.name);
    }
}