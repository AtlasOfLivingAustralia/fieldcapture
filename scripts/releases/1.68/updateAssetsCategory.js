function findProgram (name){
    name.forEach(function (programName) {
       var programQuery = db.program.find({name: programName});
        if (programQuery.hasNext()) {
            var program = programQuery.next();
            if (program){
                assignAssetCategory(program);
            }else{
                print("Program Does Not exist");
            }
        }
    });
}

function findCategory(program, assets){

    var result = null;
    program.priorities.forEach(function (priorities) {
        if (priorities.priority === assets.description) {
            result =  priorities.category;
        }
    });

    return result
}

function findNRMCategory(muId, assets) {
 var mu = db.managementUnit.find({managementUnitId: muId})
    var result = null;
    while(mu.hasNext()){
     let management = mu.next()

        management.priorities.forEach(function (priority) {
            if (priority.priority === assets.description){
                result = priority.category
            }
        });
    }
    return result;

}

function assignAssetCategory(program) {
    var projectQueryList = db.project.find({"custom.details.assets": {$exists: true}, programId: program.programId});
    print("Program Name: "+ program.name);
    while (projectQueryList.hasNext()) {
        let project = projectQueryList.next();
        project.custom.details.assets.forEach(function (asset) {
            if (!asset.category) {
                print("updating the Category for this Project: " +project.name + " Project Id: " + project.projectId)
                var category;
                if (program.priorities){
                    category = findCategory(program, asset)
                }else {
                    category = findNRMCategory(project.managementUnitId, asset)
                }

                asset.category = category

            }
        });
        db.project.save(project)
    }

}


var programName = ["Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - States", "Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM"];
findProgram(programName);
