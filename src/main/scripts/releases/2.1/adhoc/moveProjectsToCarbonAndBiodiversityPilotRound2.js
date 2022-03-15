
load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');

var userId = '129333';
var subprogram = "Carbon and Biodiversity Pilot Round 2"
var subProg = db.program.find({name: subprogram}).next();
if (!subProg) {
    print("Sub-Program is not existing: " + subProg)
} else {
    //move projects
    var projects = ["Support to the South NRM Region for technical services and delivery support of the Carbon + Biodiversity Rd 2","Support to the South Coast NRM for technical services and delivery support of the Carbon + Biodiversity Rd 2","Support to the Northern and Yorke Natural Resources Management Board for technical services and delivery support of the Carbon + Biodiversity Rd 2",
    "Support to the Fitzroy Basin Association for technical services and delivery support of the Carbon + Biodiversity Rd 2","Support to the Riverina LLS for technical services and delivery support of the Carbon + Biodiversity Rd 2","Support to the Goulburn Broken CMA for technical services and delivery support of the Carbon + Biodiversity Rd 2"]
    projects.forEach(function (project){
        var now = ISODate();
        var proj = db.project.find({name: project});
        if(proj.hasNext()){
            var p = proj.next();
            p.lastUpdated = now
            p.programId = subProg.programId
            db.project.save(p);
            audit(p, p.projectId, 'au.org.ala.ecodata.Project', userId);
        }else{
            print("Project is not existing - " + project)
        }
    });
}

