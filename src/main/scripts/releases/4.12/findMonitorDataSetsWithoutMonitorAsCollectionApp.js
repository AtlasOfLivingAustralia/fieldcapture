load('../../utils/audit.js');
let projects = db.project.find({'custom.dataSets.orgMintedIdentifier' : {$exists: true}});
let projectCount = 0;
let dataSetCount = 0;
let projectsWithIncorrectCollectionApp = 0;
while (projects.hasNext()) {
    let project = projects.next();
    projectCount++;
    let currDataSetCount = dataSetCount;
    project.custom.dataSets.forEach(dataSet => {
        if (dataSet.orgMintedIdentifier && dataSet.collectionApp && dataSet.collectionApp.toLowerCase() !== 'monitor') {
            print(project.projectId+' '+dataSet.dataSetId+' '+dataSet.collectionApp);
            dataSetCount++;
            dataSet.collectionApp = 'Monitor';
        }
    });
    if (currDataSetCount !== dataSetCount) {
        projectsWithIncorrectCollectionApp++;
        db.project.replaceOne({_id: project._id}, project);
        audit(project, project.projectId, 'au.org.ala.ecodata.Project', '<system>');
        print("Updated project: "+project.projectId);
    }
}
print(projectsWithIncorrectCollectionApp);
print(projectCount);
print(dataSetCount);