let dataSetProject = db.project.find( {"custom.dataSets": {$exists: true}});
print(dataSetProject.size())
while (dataSetProject.hasNext()) {
    let dataset = dataSetProject.next();
    dataset.custom.dataSets.forEach(function(data){
        if (data.investmentPriority){
            print("Updating investmentPriority: " + dataset.projectId)
            data.investmentPriority = [data.investmentPriority]
        }
    });
    db.project.save(dataset)
}
