let categories = {};

let managementUnitPriorities = {};
function muInvestmentPriorities() {
    let mus = db.managementUnit.find({status:{$ne:'deleted'}});
    while(mus.hasNext()) {
        
        let mu = mus.next();

        if (mu.priorities && mu.priorities.length > 0) {
            for (let p in mu.priorities) {
                let muPriority = mu.priorities[p];
                if (muPriority.priority) {
                    if (!managementUnitPriorities[muPriority.priority]) {
                        managementUnitPriorities[muPriority.priority] = [];
                    }
                    if (!categories[muPriority.category]) {
                        categories[muPriority.category] = [];
                    }

                    if (categories[muPriority.category].indexOf(muPriority.priority) < 0) {
                        categories[muPriority.category].push(muPriority.priority);
                    }

                    let muData = {name: mu.name, managementUnitId: mu.managementUnitId, category: muPriority.category};
                    let found = false;
                    for (let i = 0; i < managementUnitPriorities[muPriority.priority].length; i++) {
                        let muObj = managementUnitPriorities[muPriority.priority][i];
                        if (muObj.managementUnitId == mu.managementUnitId) {
                            // Already have this program
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        managementUnitPriorities[muPriority.priority].push(muData);
                    }


                }
            }
        }
    }
}



muInvestmentPriorities();



let programInvestmentPriorities = {};
function findProgramInvestmentPriorities() {
    let programs = db.program.find({status:{$ne:'deleted'}});
    while (programs.hasNext()) {
        let program = programs.next();

        if (program.priorities && program.priorities.length > 0) {
            for (let p in program.priorities) {
                let programPriority = program.priorities[p];
                if (programPriority.priority) {

                    if (!categories[programPriority.category]) {
                        categories[programPriority.category] = [];
                    }

                    if (categories[programPriority.category].indexOf(programPriority.priority) < 0) {
                        categories[programPriority.category].push(programPriority.priority);
                    }

                    if (!programInvestmentPriorities[programPriority.priority]) {
                        programInvestmentPriorities[programPriority.priority] = [];
                    }
                    let programData = {
                        name: program.name,
                        programId: program.programId,
                        category: programPriority.category
                    };
                    let found = false;
                    for (let i = 0; i < programInvestmentPriorities[programPriority.priority].length; i++) {
                        let programObj = programInvestmentPriorities[programPriority.priority][i];
                        if (programObj.programId == program.programId) {
                            // Already have this program
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        programInvestmentPriorities[programPriority.priority].push(programData);
                    }
                }
            }
        }
    }
}

findProgramInvestmentPriorities();

let categoryNames = Object.keys(categories);
categoryNames.sort();

print(categoryNames.join(','));

let max = 0;
for (let i=0; i<categoryNames.length; i++) {
    let category = categories[categoryNames[i]];
    max = Math.max(max, category.length);
    category.sort();
}


for (let i=0; i<max; i++) {
    let row = '';
    for (let j=0; j<categoryNames.length; j++) {
        let category = categories[categoryNames[j]];

        if (i<category.length) {
            row += '"'+category[i]+'"';
        }
        row += ',';

    }
    print(row);
}




