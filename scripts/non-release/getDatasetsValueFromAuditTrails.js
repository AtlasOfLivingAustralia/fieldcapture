
var adminUserId = '94320';
var type = 'au.org.ala.ecodata.Project';
var lastUpdated = ISODate();
var count = 0

function audit(entity, entityId, projectId) {
    var auditMessage = {
        date: lastUpdated,
        entity: entity,
        eventType: 'Update',
        entityType: type,
        entityId: entityId,
        userId: adminUserId,
        projectId: entity.projectId
    };
    db.auditMessage.insert(auditMessage);
}

function fixedDataSet(projectId, date) {
    var dataSets = db.auditMessage.find({projectId: projectId,"entity.custom.dataSets":{$ne: null}, date: {$gt: date}})

    if (dataSets.count() === 1){
        while(dataSets.hasNext()){
            var auditData = dataSets.next();
            print("Date: " + auditData.date + "Status: " + auditData.eventType)
            print(auditData.entity.custom.dataSets.length);
            var project = db.project.find({projectId: auditData.projectId}).next();
            project.custom.dataSets = auditData.entity.custom.dataSets
            db.project.save(project);
            audit(project, project.projectId, project.projectId)
        }
    }
}

var projectsDatasets = {
    projectId1: "9b0e3b8d-f0a0-486f-915e-323646f2be09",
    date1: ISODate("2021-07-21T00:56:52Z"),
    projectId2: "34e744bc-68c3-4972-905e-530e273d4fd0",
    date2: ISODate("2021-06-29T00:58:33Z"),
    projectId3: "29d49f88-963b-4fe9-b281-63c90c28c351",
    date3: ISODate("2021-07-15T06:16:46Z"),
    projectId4: "ac7cc859-32d1-43c9-a346-16d599e69e38",
    date4: ISODate("2021-05-05T23:58:28Z")
}
fixedDataSet(projectsDatasets.projectId1, projectsDatasets.date1)
fixedDataSet(projectsDatasets.projectId2, projectsDatasets.date2)
fixedDataSet(projectsDatasets.projectId3, projectsDatasets.date3)
fixedDataSet(projectsDatasets.projectId4, projectsDatasets.date4)
