let example = db.service.findOne({name:'Improving hydrological regimes'});
let programLabels = example.programLabels;

let waterProgramLabels = {};
for (let label in programLabels) {
    waterProgramLabels[label] = {label:"Water quality or hydrology survey"}
}

print(waterProgramLabels);

let waterSurveyService = db.service.findOne({name:'Water quality survey'});

waterSurveyService.programLabels = waterProgramLabels;

db.service.replaceOne({_id:waterSurveyService._id}, waterSurveyService);