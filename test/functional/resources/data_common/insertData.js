load('../data/projectDefaults.js');
load('../data/program.js');
load('../data/managementUnit.js');

function createProject(projectProperties) {
    var project = Object.assign({}, projectDefaults);
    Object.assign(project, projectProperties || {});

    db.project.insert(project);
}

function createProgram(programProperties) {
    var program = Object.assign({}, programDefaults);
    Object.assign(program, programProperties || {});

    db.program.insert(program);
}

function createMu(muProperties) {
    var mu = Object.assign({}, muDefaults);
    Object.assign(mu, muProperties || {});

    db.managementUnit.insert(mu);
}

