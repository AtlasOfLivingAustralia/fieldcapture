var programsToChange = [
    'Natural Resource Management - Landscape',
    'Fisheries Habitat Restoration',
    'Agriculture Stewardship',
    'Carbon and Biodiversity Pilot Round 2',
    'WA NLP Projects',
    'Post-fire monitoring',
    'Strategic and Multi-regional - Koalas'
];


var oldActivityType = 'RLP Annual Report';
var newActivityType = 'Annual Report 2022';
var oldOutputType = 'RLP Annual Report';
var newOutputType = 'Annual Report 2022';

for (var i=0; i<programsToChange.length; i++) {
    var program = db.program.findOne({name:programsToChange[i]});

    if (!program) {
        throw 'Cannot find program: '+programsToChange[i];
    }
}

for (var i=0; i<programsToChange.length; i++) {
    var program = db.program.findOne({name:programsToChange[i]});
    var reports = program.config.projectReports;
    for (var j=0; j<reports.length; j++) {
        if (reports[j].activityType == oldActivityType) {
            reports[j].activityType = newActivityType;
            print("updating report config for "+programsToChange[i]);
        }
    }
    db.program.save(program);

    var projects = db.project.distinct('projectId', {programId:program.programId, status:{$ne:'deleted'}});
    print("found "+projects.length+" projects for "+programsToChange[i]);
    var reports = db.report.find({projectId:{$in:projects}, activityType:'RLP Annual Report', status:{$ne:'deleted'}});
    print("found "+reports.count()+" reports for "+programsToChange[i]);

    while (reports.hasNext()) {
        var report = reports.next();
        var activity = db.activity.findOne({activityId:report.activityId});

        if (activity.publicationStatus != 'pendingApproval' && activity.publicationStatus != 'published') {
            // update the activity type and version and associated output to the new form
            activity.type = newActivityType;
            if (activity.progress && activity.progress != 'planned') {
                activity.formVersion = NumberInt(1);
                db.output.update({activityId:activity.activityId, name:oldActivityType}, {$set:{name:newActivityType}});
            }
            print("******** Updating activity "+activity.description+' for project '+activity.projectId+' status: '+activity.progress+', '+activity.publicationStatus);
            print(report.activityType);
            db.activity.save(activity);
            report.activityType = newActivityType;
            db.report.save(report);

        }
        else {
            print("NOT Updating activity "+activity.description+' for project '+activity.projectId+' status: '+activity.progress+', '+activity.publicationStatus);
        }

    }

}
