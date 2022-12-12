load('../../../utils/audit.js')
var adminUserId = ''

var site = db.site.findOne({siteId:'934f6444-a608-4f7c-9dcc-7974872841dc'});

var reportActivityId = 'c92419e3-a025-4898-bbc8-923d7e384ea0';
var controllingAccess = db.output.findOne({activityId:reportActivityId, name:/Controlling/});
doWithFeatureArray(controllingAccess, controllingAccess.data.accessControlDetails, 'sitesInstalled');

var managementPlan = db.output.findOne({activityId:reportActivityId, name:/RLP - Management plan development/})
doWithFeatureArray(managementPlan, managementPlan.data.managementPlans, 'sitesCoveredByPlan')

var landManagement = db.output.findOne({activityId:reportActivityId, name:/RLP - Improving land management practices/})
doWithFeatureArray(landManagement, landManagement.data.landManagementDetails, 'implementationSite')

var revegHabitat = db.output.findOne({activityId:reportActivityId, name:/Revegetating habitat/})
doWithFeatureArray(revegHabitat, revegHabitat.data.revegetationArea, 'sitesRevegetated')



function doWithFeatureArray(output, featureArray, sitePath) {

    for (var i = 0; i < featureArray.length; i++) {
        var featureIds = featureArray[i][sitePath].featureIds;
        print(featureIds.length);
        var toRemove = featureIds.splice(featureIds.length / 2, featureIds.length / 2);

        for (var j = 0; j < toRemove.length; j++) {
            var featureId = toRemove[j];
            for (var k = 0; k < site.features.length; k++) {
                if (site.features[k].properties.id == featureId) {
                    var removedFeature = site.features.splice(k, 1);
                    print("Removed: " + removedFeature[0].properties.id);
                }
            }
        }

    }

    db.output.replaceOne({_id:output._id}, output);
    audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId)

    db.site.replaceOne({_id:site._id}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId)
}
