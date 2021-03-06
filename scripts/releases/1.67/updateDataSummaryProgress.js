
// This change is done under https://github.com/AtlasOfLivingAustralia/fieldcapture/issues/2170
// Update the dataset summary progress to finished for the existing summaries

print("Start to update dataset summary progress");

db.project.find({isMERIT:true, "custom.dataSets" : {$ne:null}, "custom.dataSets.progress":null})
    .forEach(function (project) {
        project.custom.dataSets.forEach(function (dataset) {
            if (dataset.progress == null) {
                dataset.progress="finished";
            }
        });
        db.project.save(project);
    });

print("Completed!");