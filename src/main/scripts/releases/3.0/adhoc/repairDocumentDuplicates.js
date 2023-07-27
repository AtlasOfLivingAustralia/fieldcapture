load('../../../utils/audit.js')
var adminUserId = ''
var reportActivityId = 'af4474c1-abf1-427f-b60b-8b15d3d3912b';
var projectId = '';

var communityEngagement = db.output.findOne({activityId:reportActivityId, name:/Community engage/});
removeImageDuplicates(communityEngagement, 'photographicEvidence');

var controllingAccess = db.output.findOne({activityId:reportActivityId, name:/Controlling/});
removeImageDuplicates(controllingAccess, 'photographicEvidence');

var managementPlanDevelopment = db.output.findOne({activityId:reportActivityId, name:/Management plan/});
removeImageDuplicates(managementPlanDevelopment, 'photographicEvidence');

var identifyingSites = db.output.findOne({activityId:reportActivityId, name:/Identifying sites/});
removeImageDuplicates(identifyingSites, 'photographicEvidence');

var improvingLandManagement = db.output.findOne({activityId:reportActivityId, name:/Improving land management/});
removeImageDuplicates(improvingLandManagement, 'photographicEvidence');

var skillsAndKnowledge = db.output.findOne({activityId:reportActivityId, name:/Skills and knowledge/});
removeImageDuplicates(skillsAndKnowledge, 'photographicEvidence');

function removeImageDuplicates(output, imagesPath) {

    print ("Checking: " + output.name);
    let documentIds = {};
    if (!output.data[imagesPath]) {
        print("No images: " + output.name);
        return;
    }
    else {
        print("Images: " + output.data[imagesPath].length);
    }
    for (let i=0; i<output.data[imagesPath].length; i++) {
        var documentId = output.data[imagesPath][i].documentId;

        if (documentIds[documentId] != null) {
            print("Duplicate: " + documentId);
            output.data[imagesPath].splice(i, 1);
            i--;
        }
        else {
            documentIds[documentId] = true;
        }
    }

    db.output.replaceOne({outputId:output.outputId}, output);
    audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId);
}