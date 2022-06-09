var reports = db.report.find({activityType:'RLP Core Services report', toDate:{$gt:ISODate('2022-05-20'), $lt:ISODate('2022-06-10')}, status:{$ne:'deleted'}});

while (reports.hasNext()) {
    var report = reports.next();

    var mu = db.managementUnit.findOne({managementUnitId:report.managementUnitId});

    print('https://fieldcapture.ala.org.au/managementUnit/index/'+report.managementUnitId+','+mu.name+','+report.name+','+report.publicationStatus);
}

db.activity.find({type:'RLP Core Services report', plannedEndDate:{$gt:ISODate('2022-06-20'), $lt:ISODate('2022-07-10')}, status:{$ne:'deleted'}, progress:{$ne:'planned'}}, {description:true, progress:true, publicationStatus:true});