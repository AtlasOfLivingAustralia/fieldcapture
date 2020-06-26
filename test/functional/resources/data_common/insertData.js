load('../data/projectDefaults.js');
load('../data/program.js');
load('../data/managementUnit.js');
load('../data/siteDefaults.js');
load('../data/activityForms/RLPOutputReport.js');
load('../data/activityForms/CoreServicesReport.js');
load('../data/activityForms/ProgressReport.js');
load('../data/scoreDefaults.js');
load('../data/activityDefaults.js');
load('../data/outputDefaults.js');


function createProject(projectProperties) {
    // var project = Object.assign({}, projectDefaults);
    // Object.assign(project, projectProperties || {});
    var project = projectDefaults.create()
    assign(projectProperties,project)

    db.project.insert(project);
}

function createProgram(programProperties) {
    //Avoid possibile compatibility of js
    //var program = Object.assign({}, programDefaults);
    //Object.assign(program, programProperties || {});

    var program = programDefaults.create()
    assign(programProperties,program)
    db.program.insert(program);
}

function createOrganisation(organisationProperties){
    db.organisation.insert(organisationProperties)
}

function createMu(muProperties) {
    // var mu = Object.assign({}, muDefaults);
    // Object.assign(mu, muProperties || {});

    var mu = muDefaults.create()
    assign(muProperties,mu)
    db.managementUnit.insert(mu);
}

function createScoreWeedHaDefaults(weedsProperties) {
    var weedHa = scoreWeedHaDefaults.create();
    assign(weedsProperties, weedHa);
    db.score.insert(weedHa);

}

function createActivities(activities){
    var activity = activityDefaults.create();
    assign(activities, activity);
    db.activity.insert(activity);
}

function createOutput(outputs) {
    var out = outputDefaults.create();
    assign(outputs, out);
    db.output.insert(out);
}

function createPestOutDataDefaults(pestData){
    var pestOutput =pestOutDataDefaults.create();
    assign(pestData, pestOutput);
    db.output.insert(pestOutput);
}
function createScoreInvasiveSpecies(invasiveSpecies){
    var species = scoreInvasiveSpeciesDefaults.create();
    assign(invasiveSpecies, species);
    db.score.insert(species);
}


function createSite(siteProperties) {
    // var mu = Object.assign({}, muDefaults);
    // Object.assign(mu, muProperties || {});

    var site = siteDefaults.create()
    assign(siteProperties,site)
    db.site.insert(site);
}

function loadActivityForms() {
    db.activityForm.insert(rlpOutputReport);
    db.activityForm.insert(coreServicesReport);
    db.activityForm.insert(progressReport);
}


/**
 * Be aware of copying Date may lose turn it to String
 * @param src
 * @param des
 */
function assign(src, des){
    for(var prop in src){
        if(src.hasOwnProperty(prop)){
            if(isObject(src[prop])) {
                if ( Array.isArray(src[prop]))
                    des[prop] = []
                else
                    des[prop] ={}
                assign(src[prop],des[prop])
            }else{
                des[prop] = src[prop]
            }
        }
    }

}
