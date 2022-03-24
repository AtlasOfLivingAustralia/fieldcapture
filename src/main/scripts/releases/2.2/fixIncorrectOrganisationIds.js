var projects = db.project.find({isMERIT:true, status:{$ne:'deleted'}});

db.organisation.update({organisationId:'130e6fb8-f158-41b2-8280-da678a07025e'}, {$set:{name:'CO2 Australia Limited'}});
db.organisation.update({organisationId:'d274cd91-cc1d-4098-9be7-a7f1245ca3ab'}, {$set:{name:'NRM North'}});
db.organisation.update({organisationId:'bc371753-b6e4-449a-8e1d-80a0eab4be64'}, {$set:{name:'West Gippsland CMA'}});
db.organisation.update({organisationId:'4a5fef58-2c56-4f27-baf6-14db228e9472'}, {$set:{name:'East Gippsland CMA'}});
db.organisation.update({organisationId:'b5839b6e-15f2-4c7f-ac3a-09c6f0c2203a'}, {$set:{name:'Western Local Land Services'}});
db.organisation.update({organisationId:'d274cd91-cc1d-4098-9be7-a7f1245ca3ab'}, {$set:{name:'NRM North'}});
db.organisation.update({organisationId:'03d075b9-3ba6-4d7c-9316-863e29c889cb'}, {$set:{name:'North West Local Land Services'}});
db.organisation.update({organisationId:'0ae61cc9-bf8e-4905-920e-038c6bbca3c4'}, {$set:{name:'Murray Local Land Services'}});
db.organisation.update({organisationId:'4394710a-3637-436a-97d7-b89a692f21a2'}, {$set:{name:'ET Australia South Coast'}});
db.organisation.update({organisationId:'1a9fdca8-e7af-49bc-a0ca-4dc8f7629e99'}, {$set:{name:'Tasmanian Department of Primary Industries, Parks, Water and Environment'}});
while (projects.hasNext()) {
    var project = projects.next();

    if (project.organisationId) {
        var org = db.organisation.findOne({organisationId: project.organisationId});

        if (!org) {
            print("No organisation exists with id: "+project.organisationId);
        }
        else if (!org.name) {
            print("Organisation "+project.organisationId+" has no name!");
        }
        else if (project.organisationId == '529f59ac-59d5-405b-954c-31b31fc619d0' && project.organisationName != 'Zoos Victoria') {
            project.organisationId = null;
            db.project.save(project);
        }
        else if (project.organisationId == '4a5fef58-2c56-4f27-baf6-14db228e9472' && project.organisationName != 'East Gippsland CMA') {
            project.organisationId = null;
            db.project.save(project);
        }
        else if (org.name != project.organisationName) {
            print("Found mismatch: "+project.organisationId + " "+project.organisationName+ " "+org.name);
        }

    }
}