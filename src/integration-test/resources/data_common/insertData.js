load('../data/projectDefaults.js');
load('../data/program.js');
load('../data/managementUnit.js');
load('../data/siteDefaults.js');
load('../data/activityForms/RLPOutputReport.js');
load('../data/activityForms/CoreServicesReport.js');
load('../data/activityForms/ProgressReport.js');
load('../data/activityForms/Revegetation.js');
load('../data/activityForms/PlantPropogation.js')
load('../data/activityForms/ESPActivityReport.js')
load('../data/scoreDefaults.js');
load('../data/activityDefaults.js');
load('../data/outputDefaults.js');
load('../data_common/createServices.js');
load('../data/organisation.js');


function createProject(projectProperties) {
    // var project = Object.assign({}, projectDefaults);
    // Object.assign(project, projectProperties || {});
    var project = projectDefaults.create()
    assign(projectProperties,project)

    db.project.insert(project);
    return project;
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
    if (!organisationProperties.hubId) {
        organisationProperties.hubId = "merit";
    }

    var org = orgDefaults.create()
    assign(organisationProperties,org)
    db.organisation.insert(org)
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

function createProjectNumberBaselineDataSets(data){
    var scoreDefault = projectNumberBaselineDataSets.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);

}
function createProjectNumberOfCommunicationMaterialsPublished(data){
    var scoreDefault = projectNumberOfCommunicationMaterialsPublished.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);

}
function createProjectWeedAreaSurveyedHaDefault(data){
    var scoreDefault = projectWeedAreaSurveyedHaDefault.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectWeedNumberOfSurveysConductedDefault(data){
    var scoreDefault = projectWeedNumberOfSurveysConductedDefault.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectPestAreaFollowup(data){
    var scoreDefault = projectPestAreaFollowup.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectPestAreaInitial(data){
    var scoreDefault = projectPestAreaInitial.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectAccessHasBeenControlled(data){
    var scoreDefault = projectAccessHasBeenControlled.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectRLPLengthInstalled(data){
    var scoreDefault = projectRLPLengthInstalled.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectCommunityAdviceInteractions(data){
    var scoreDefault = projectCommunityAdviceInteractions.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectCommunitySeminars(data){
    var scoreDefault = projectCommunitySeminars.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectCommunityWorkshopEvent(data){
    var scoreDefault = projectCommunityWorkshopEvent.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectCommunityFiledDays(data){
    var scoreDefault = projectCommunityFiledDays.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectRLPNumberOfStructuresInstalled(data){
    var scoreDefault = projectRLPNumberOfStructuresInstalled.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectCommunityOnGroundWorks(data){
    var scoreDefault = projectCommunityOnGroundWorks.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
}
function createProjectCommunityDemostrations(data){
    var scoreDefault = projectCommunityDemostrations.create();
    assign(data, scoreDefault)
    db.score.insert(scoreDefault);
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
    db.activityForm.insert(revegetation);
    db.activityForm.insert(plantPropogation);
    db.activityForm.insert(espPMUReport);

    var forms = db.activityForm.find({});
    print("Total Forms in DB: " + forms.count());
    forms.forEach( function (form){
        if (form){
            print("Updating Form Version From Double to Int: " + form.name)
            db.activityForm.update({_id: form._id},{$set: {formVersion:NumberInt(form.formVersion), minOptionalSectionsCompleted: NumberInt(form.minOptionalSectionsCompleted)}})
        }
    });

    var forms2 = db.activity.find({});
    print("Total activities in DB: " + forms2.count());
    forms2.forEach( function (form){
        if (form){
            print("Updating Form Version From Double to Int: " + form.type)
            db.activity.update({activityId: form.activityId},{$set: {formVersion:NumberInt(form.formVersion)}})
        }
    });

    // Insert protocol forms into activityForm collection
    var forms = [{
        "name": "Protocol 1",
        "type":"EMSA",
        "category":"Category 1",
        "externalIds": [{ externalId: "1", idType:"MONITOR_PROTOCOL_INTERNAL_ID" }, { externalId: "guid-1", idType:"MONITOR_PROTOCOL_GUID" }],
        "external":true,
        "formVersion": NumberInt(1),
        "publicationStatus":"published",
        "tags":["survey"]
    }, {
        "name": "Protocol 2",
        "type":"EMSA",
        "category":"Category 2",
        "externalIds": [{ externalId: "2", idType:"MONITOR_PROTOCOL_INTERNAL_ID" }, { externalId: "guid-2", idType:"MONITOR_PROTOCOL_GUID" }],
        "external":true,
        "formVersion": NumberInt(1),
        "publicationStatus":"published",
        "tags": ["intervention"]
    }, {
        "name": "Protocol 3",
        "type":"EMSA",
        "category":"Category 3",
        "externalIds": [{ externalId: "3", idType:"MONITOR_PROTOCOL_INTERNAL_ID" }, { externalId: "guid-3", idType:"MONITOR_PROTOCOL_GUID" }],

        "external":true,
        "formVersion": NumberInt(1),
        "publicationStatus":"published",
        "tags": ["survey"]

    }];
    for (let i= 0; i < forms.length; i++) {
        db.activityForm.insert(forms[i]);
    }
}


/**
 * Be aware of copying Date may lose turn it to String
 * @param src
 * @param des
 */
function assign(src, des){
    print("assign")
    for(var prop in src){
        if(src.hasOwnProperty(prop)){
            if(src[prop] && (typeof src[prop] == 'object') && !(src[prop] instanceof Date) && !(src[prop] instanceof NumberDecimal)) {
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
function addStaticContentSettings() {
    addSetting('meritfielddata.help.text', "This is help content")
    addSetting('meritfielddata.contacts.text', "This is contacts content")
    addSetting('meritfielddata.about.text', "This is about content")
    addSetting('meritfielddata.news.text', "This is news content")

}

function addSetting(key, value) {
    db.setting.insert({key:key, value:value});
}
