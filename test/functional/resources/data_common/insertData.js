load('../data/projectDefaults.js');
load('../data/program.js');
load('../data/managementUnit.js');
load('../data/siteDefaults.js');
load('../data/activityForms/RLPOutputReport.js');

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

function createMu(muProperties) {
    // var mu = Object.assign({}, muDefaults);
    // Object.assign(mu, muProperties || {});

    var mu = muDefaults.create()
    assign(muProperties,mu)
    db.managementUnit.insert(mu);
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