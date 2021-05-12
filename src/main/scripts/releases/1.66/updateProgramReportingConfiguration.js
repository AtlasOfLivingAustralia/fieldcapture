var projectReports = [
    {
        "reportType": "Activity",
        "firstReportingPeriodEnd": "2018-09-30T14:00:00Z",
        "reportDescriptionFormat": "Year %5$s - %6$s %7$d Outputs Report",
        "reportNameFormat": "Year %5$s - %6$s %7$d Outputs Report",
        "reportingPeriodInMonths": 3,
        "description": "",
        "category": "Outputs Reporting",
        "activityType": "RLP Output Report",
        "canSubmitDuringReportingPeriod": true
    },
    {
        "firstReportingPeriodEnd": "2019-06-30T14:00:00Z",
        "reportType": "Administrative",
        "reportDescriptionFormat": "Annual Progress Report %2$tY - %3$tY for %4$s",
        "reportNameFormat": "Annual Progress Report %2$tY - %3$tY",
        "reportingPeriodInMonths": 12,
        "description": "",
        "category": "Annual Progress Reporting",
        "activityType": "RLP Annual Report"
    },
    {
        "reportType": "Single",
        "firstReportingPeriodEnd": "2021-06-30T14:00:00Z",
        "reportDescriptionFormat": "Outcomes Report 1 for %4$s",
        "reportNameFormat": "Outcomes Report 1",
        "reportingPeriodInMonths": 36,
        "multiple": false,
        "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
        "category": "Outcomes Report 1",
        "reportsAlignedToCalendar": false,
        "activityType": "RLP Short term project outcomes"
    },
    {
        "reportType": "Single",
        "firstReportingPeriodEnd": "2023-06-30T14:00:00Z",
        "reportDescriptionFormat": "Outcomes Report 2 for %4$s",
        "reportNameFormat": "Outcomes Report 2",
        "reportingPeriodInMonths": 0,
        "multiple": false,
        "description": "_Please note that the reporting fields for these reports are currently being developed_",
        "minimumPeriodInMonths": 37,
        "category": "Outcomes Report 2",
        "reportsAlignedToCalendar": false,
        "activityType": "RLP Medium term project outcomes"
    }
];

var programsToUpdate = [
    "Regional Land Partnerships",
    "Pest Mitigation and Habitat Protection",
    "Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM",
    "Direct source procurement",
    "Fisheries Habitat Restoration",
    "Natural Resource Management - Landscape",
    "Environmental Restoration Fund",
    "Reef Trust 7 - Coastal Habitat and Species",
    "Reef Trust 7 - Water Quality"
];

for (var i=0; i<programsToUpdate.length; i++) {
    var program = db.program.findOne({name:programsToUpdate[i]});
    program.config.projectReports = projectReports;
    db.program.save(program);
}

// Now remove some of the configuration from the management units so it doesn't override
// the dates for the reports that aren't configurable via MU.

var mus = db.managementUnit.find({status:{$ne:'deleted'}});
while (mus.hasNext()) {
    var mu = mus.next();

    if (mu.config && mu.config.projectReports) {
        var rlpOutputReport;
        for (var i=0; i<mu.config.projectReports.length; i++) {
            if (mu.config.projectReports[i].activityType == "RLP Output Report") {
                rlpOutputReport = mu.config.projectReports[i];
            }
        }
        if (rlpOutputReport) {
            mu.config.projectReports = [rlpOutputReport];
            print("Updating reports for "+mu.name);
            db.managementUnit.save(mu);
        }

    }

}

var bushfireNrm = db.program.findOne({name : 'Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM'});
bushfireNrm.config.projectReports[2].firstReportingPeriodEnd = '2022-06-30T14:00:00Z';
db.program.save(bushfireNrm);
print("##############################################################################################################################");
print("# After running this script, go to https://fieldcapture.ala.org.au/program/index/"+bushfireNrm.programId+" and regenerate the outcomes reports");
print("##############################################################################################################################");