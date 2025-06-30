load('../../../utils/uuid.js');
load('../../../utils/audit.js');
load('../../../utils/program.js');
load("../../../utils/addService.js")


let result = db.service.aggregate([{ $group: { _id: null, maxValue: { $max: "$legacyId"}}}])


let maxLegacyId = result.toArray()[0].maxValue;
const adminUserId = "system";

let forms = ['NHT Output Report', 'Grants and Others Progress Report', 'Procurement Output Report'];
const sectionName = "Sustainable Agriculture - Farms and Community Groups";

let outputs = [];
forms.forEach(form => {
    outputs.push({
        formName: form,
        sectionName: sectionName
    });
});

const serviceName = "Sustainable agriculture practices"

let service = db.service.findOne({name: serviceName});
let newServiceId;
if (service) {
    newServiceId = service.legacyId;
}
else {
    newServiceId = maxLegacyId+1;
}

addService(serviceName, NumberInt(newServiceId), null, null, outputs, adminUserId);

function addScore(scoreId, scoreLabel, formSection, formFieldToAggregate) {
    let score =
        {
            scoreId: scoreId,
            entityTypes: undefined,
            tags: [],
            displayType: '',
            entity: 'Activity',
            outputType: formSection,
            isOutputTarget: false,
            category: "Sustainable Agriculture",
            status: 'active',
            label: scoreLabel,
            description: '',
            configuration: {
                childAggregations: [
                    {
                        filter: {
                            property: 'name',
                            filterValue: formSection,
                            type: 'filter'
                        },
                        childAggregations: [
                            {
                                property: 'data.' + formFieldToAggregate,
                                type: 'SUM'
                            }
                        ]
                    }
                ]
            }
        };

    let savedScore = db.score.find({scoreId: scoreId});
    if (savedScore) {
        db.score.replaceOne({scoreId: scoreId}, score);
    } else {
        db.score.insertOne(score);
    }
};
const communityGroupsSupportedScoreId = '81db2acb-e2ec-4f9a-9e99-de4533fc8d8c';
const farmsSupportedScoreId = '8cfaf8f3-21ed-48b4-b247-d6772ecbac41';
addScore(communityGroupsSupportedScoreId, 'Total community groups supported adopting sustainable agriculture practices', sectionName, 'numberOfCommunityGroupsSupported');
addScore(farmsSupportedScoreId, 'Total farms adopting sustainable agriculture practices', sectionName, 'numberOfFarmsAdoptingSustainablePractices');
//
// forms.forEach(formName => {
//     let programs = db.program.find({'config.programServiceConfig.serviceFormName':formName, status:{$ne:'deleted'}});
//     while (programs.hasNext()) {
//         var program = programs.next();
//
//         updateProgramServiceConfig(program, newServiceId, [], false);
//
//
//         db.program.updateOne({programId: program.programId}, {$set: {config: program.config}});
//         audit(program, program.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");
//         print("Updated "+ program.name);
//     }
// });


//
//
// let firstNationsPSO = db.service.findOne({legacyId:50});
// firstNationsPSO.outputs[0].formName = formName;
//
// db.service.replaceOne({legacyId:50}, firstNationsPSO);
// audit(firstNationsPSO, firstNationsPSO.serviceId, 'au.org.ala.ecodata.Service', adminUserId, undefined, "Update");
//
// let firstNationsProgram = db.program.findOne({name: "First Nations Delivery Partner"});
// firstNationsProgram.config.programServiceConfig.serviceFormName = formName;
// firstNationsProgram.config.projectReports[0].activityType = formName;
//
// db.program.updateOne({programId: firstNationsProgram.programId}, {$set: {config: firstNationsProgram.config}});
// audit(firstNationsProgram, firstNationsProgram.programId, 'au.org.ala.ecodata.Program', adminUserId, undefined, "Update");