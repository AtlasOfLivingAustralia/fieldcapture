load('../../../utils/audit.js')
var adminUserId = '1493'

var site = db.site.findOne({siteId:'cf6fb5b0-69e2-45a7-8a00-01b92f635db9'});

var reportActivityId = 'af4474c1-abf1-427f-b60b-8b15d3d3912b';
var controllingAccess = db.output.findOne({activityId:reportActivityId, name:/Controlling/});
doWithFeatureArray(controllingAccess, controllingAccess.data.accessControlDetails, 'sitesInstalled', 3);
doWithFeatureArray(controllingAccess, controllingAccess.data.accessControlDetails, 'protectedSites', 1);

var managementPlanDevelopment = db.output.findOne({activityId:reportActivityId, name:/Management plan/});
doWithFeatureArray(managementPlanDevelopment, managementPlanDevelopment.data.managementPlans, 'sitesCoveredByPlan', 2);

var improvingLandManagement = db.output.findOne({activityId:reportActivityId, name:/Improving land management/});
doWithFeatureArray(improvingLandManagement, improvingLandManagement.data.landManagementDetails, 'implementationSite', 2);

function doWithFeatureArray(output, featureArray, sitePath, maxFeatures) {

    for (var i = 0; i < maxFeatures; i++) {
        if (!featureArray[i][sitePath]) {
            continue;
        }
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

    db.output.replaceOne({outputId:output.outputId}, output);
    audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId)

    db.site.replaceOne({siteId:site.siteId}, site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId)
}
