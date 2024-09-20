load("../../../utils/uuid.js");
load( "../../../utils/audit.js");

function addScore(scoreId, label, category, description, outputType, configuration, isOutputTarget, userId) {
    var score = db.score.findOne({label:label});
    if (!scoreId) {
        print("Including a scoreId is recommended to keep ids the same across environments");
        scoreId = UUID.generate();
    }
    if (score) {
        score.configuration = configuration;
        score.scoreId = scoreId;
        score.category = category;
        score.outputType = outputType;
        score.isOutputTarget = isOutputTarget;
        score.outputType = outputType;
        score.category = category;
        db.score.replaceOne({label:label}, score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', userId);
    }
    else {
        score = {
            category: category,
            configuration: configuration,
            description: description,
            displayType: "",
            entity: "Activity",
            entityTypes: [],
            isOutputTarget: isOutputTarget,
            label: label,
            outputType: outputType,
            scoreId: scoreId,
            status: "active"
        }
        db.score.insertOne(score);
        audit(score, score.scoreId, 'au.org.ala.ecodata.Score', userId, undefined, 'Insert');
    }

}