
// This change is done under https://github.com/AtlasOfLivingAustralia/fieldcapture/issues/2150
// Allow the "last collection date" in the data set summary to be "ongoing"

print("Start to update dataset summary ongoing project status");

db.project.find({isMERIT:true, "custom.dataSets" : {$ne:null}, "custom.dataSets.dataCollectionOngoing":null})
    .forEach(function (project) {
        project.custom.dataSets.forEach(function (dataset) {
            if (dataset.dataCollectionOngoing == null) {
                dataset.dataCollectionOngoing = false;
            }
        });
        db.project.save(project);
    });

print("Completed!");