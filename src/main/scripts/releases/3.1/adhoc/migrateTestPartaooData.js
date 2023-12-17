const programs=['Recovery Actions for Species and Landscapes'];
for (let i=0; i<programs.length; i++) {
    const program = db.program.findOne({name:programs[i]});

    let projects = db.project.find({programId:program.programId});

    while (projects.hasNext()) {
        let project = projects.next();
        let sites = db.site.find({projects:project.projectId, externalIds:{$ne:null}, type:'surveyArea'});
        while (sites.hasNext()) {
            let site = sites.next();
            site.externalIds[0].idType = "MONITOR_PLOT_GUID";

            print("Updating site "+site.name+" for project "+project.name);
            db.site.replaceOne({_id:site._id}, site);
        }
    }

}