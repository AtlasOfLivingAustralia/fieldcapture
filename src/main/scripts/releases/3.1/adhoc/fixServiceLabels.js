load('../../../utils/uuid.js');
// Add labels and output mapping for services used by the new program

let mainProgram = db.program.findOne({name:'Natural Heritage Trust'});

var programName = 'Recovery Actions for Species and Landscapes';
var program = db.program.findOne({name:programName});


let structuresScore = db.score.findOne({label:'Number of structures installed that control access'});
let oldStructuresScore = db.score.findOne({label: 'Number of structures installed'});
let oldStructuresScoreId = oldStructuresScore.scoreId;

if (!structuresScore) {
    structuresScore = db.score.findOne({label: 'Number of structures installed'});

    delete structuresScore._id;
    structuresScore.label = 'Number of structures installed that control access';
    structuresScore.scoreId = UUID.generate();
    db.score.insertOne(structuresScore);
}

db.service.updateOne({name:'Habitat Condition Assessment Survey'}, {$set:{name:'Habitat condition assessment survey'}})
db.service.updateOne({name:'First Nations Australians Cultural Practices'}, {$set:{name:'First nations Australians cultural practices'}})
db.service.updateOne({name:'Sustainable Agriculture Facilitators'}, {$set:{name:'Sustainable agriculture facilitators'}})


let programScores = program.config.programServiceConfig.programServices;
let hydrologyService = db.service.findOne({name:'Remediating riparian and aquatic areas'});
let controllingAccessService = db.service.findOne({name:"Controlling access"});
let foundSAF = false;
let foundCulturalPractices = false;

let safService = db.service.findOne({name:'Sustainable agriculture facilitators'});
let culturalPracticesService = db.service.findOne({name:'First nations Australians cultural practices'});

for (let i=0; i<programScores.length; i++) {

    if (programScores[i].serviceId == hydrologyService.legacyId) {
        const score = db.score.findOne({label:'Number of structures installed to promote aquatic health'});
        if (programScores[i].serviceTargets.indexOf(score.scoreId) == -1) {
            programScores[i].serviceTargets.push(score.scoreId);
        }
    }

    if (programScores[i].serviceId == controllingAccessService.legacyId) {

        programScores[i].serviceTargets.splice(programScores[i].serviceTargets.indexOf(oldStructuresScoreId), 1);
        if (programScores[i].serviceTargets.indexOf(structuresScore.scoreId) == -1) {
            programScores[i].serviceTargets.push(structuresScore.scoreId);
        }

    }

    if (programScores[i].serviceId == safService.legacyId) {
        foundSAF = true;
    }
    if (programScores[i].serviceId == culturalPracticesService.legacyId) {
        foundCulturalPractices = true;
    }
}
if (!foundSAF) {
    let safScore = db.score.findOne({label:'Number of SAF FTEs invoiced for'});
    programScores.push({serviceId:safService.legacyId, serviceTargets:[safScore.scoreId]});
}
if (!foundCulturalPractices) {
    let culturalPracticesScore = db.score.findOne({label:'Number of days conducting cultural practices'});
    programScores.push({serviceId:culturalPracticesService.legacyId, serviceTargets:[culturalPracticesScore.scoreId]});
}
db.program.replaceOne({_id:program._id}, program);


let services = db.service.find({programLabels:{$ne:null}});
while(services.hasNext()) {
    let service = services.next();
    let label = service.programLabels[mainProgram.programId].label;

    service.programLabels[program.programId] = {label:label};
    print("Updating label for service " + service.name + " to " + label);
    db.service.replaceOne({_id:service._id}, service);
}

let oldLabelNewLabel = [
    {oldLabel:'Establishing and maintaining agreements', newLabel: 'Establishing and implementing conservation agreements'},
    {oldLabel: 'Establishing and maintaining feral-free enclosures', newLabel: 'Establishing and maintaining pest animal-free enclosures'},
    {oldLabel: 'Establishing and maintaining breeding programs', newLabel: 'Captive breeding, translocation or re-introduction programs'},
    {oldLabel: 'Fire management actions', newLabel: 'Implementing fire management actions'},
    {oldLabel: 'Identifying the location of potential sites', newLabel: 'Identifying and prioritising the location of potential sites'},
    {oldLabel: 'Improving hydrological regimes', newLabel: 'Improving hydrological regimes for site eco-hydrology'},
    {oldLabel: 'Managing disease', newLabel: 'Managing disease'},
    {oldLabel: 'Plant survival survey', newLabel: 'Seed germination/plant survival survey'},
    {oldLabel: 'Seed collection', newLabel: 'Seed collection and propagation'},
    {oldLabel: 'Undertaking emergency interventions to prevent extinctions', newLabel: 'Undertaking emergency interventions to prevent extinctions'},

]

for (let i=0; i<oldLabelNewLabel.length; i++) {
    let service = db.service.findOne({name:oldLabelNewLabel[i].oldLabel});
    for (let label in service.programLabels) {
        if (service.programLabels.hasOwnProperty(label)) {
            service.programLabels[label].label = oldLabelNewLabel[i].newLabel;
        }
    }
    print("Updating label for service " + service.name + " from "+ oldLabelNewLabel[i].oldLabel + "to " + oldLabelNewLabel[i].newLabel);
    db.service.replaceOne({_id:service._id}, service);
}



