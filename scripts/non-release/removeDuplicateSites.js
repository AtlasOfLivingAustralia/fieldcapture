// please make sure project Id is correct
var sites = db.site.find({ projects:"a3347117-4530-45f4-b173-678557c5b9f5",
    dateCreated: {$gte: new ISODate('2021-06-15T05:40:36.549+00:00')}, type: 'worksArea', status: 'active'});

print(sites.count());

sites.forEach(function (site){

    if (site.status === "active") {
        site.status = "deleted"
        print("Updating status of the duplicate shapefile that uploaded on 2021-06-16 : Name: " + site.name +" Status: " + site.status)
        db.site.save(site)
    }
});

// var deletedSites = db.site.find({ projects:"a3347117-4530-45f4-b173-678557c5b9f5",
//     dateCreated: {$gte: new ISODate('2021-06-15T05:40:36.549+00:00')}, type: 'worksArea', status: 'deleted'});
// print("Removing Sites")
// print(deletedSites.count());
// deletedSites.forEach(function (deletedSite){
//     if (deletedSite.status === "deleted") {
//         print("Removing deleted  shapefile that uploaded on 2021-06-16 : Name: " + deletedSite.name +" Status: " + deletedSite.status)
//         db.site.remove(deletedSite)
//     }
// });
