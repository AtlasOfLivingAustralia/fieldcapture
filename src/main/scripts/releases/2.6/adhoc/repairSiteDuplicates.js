load('../../../utils/audit.js')
var adminUserId = ''

var site = db.site.findOne({siteId:'30bf41ed-941d-4d7b-9e0a-942903a999ed'});

var reportActivityId = '1cdcbe53-a79a-42a6-acda-d60a21670b29';
var controllingAccess = db.output.findOne({activityId:reportActivityId, name:/Controlling/});
doWithFeatureArray(controllingAccess, controllingAccess.data.accessControlDetails, 'sitesInstalled');

var fireManagement = db.output.findOne({activityId:reportActivityId, name:/Fire/})
doWithFeatureArray(fireManagement, fireManagement.data.fireManagementDetails, 'sitesTreated')

var plantSurvival = db.output.findOne({activityId:reportActivityId, name:/Plant survival/})
doWithFeatureArray(plantSurvival, plantSurvival.data.plantSurvivalSurveys, 'sitesSurveyed')

var managementPlan = db.output.findOne({activityId:reportActivityId, name:/Management plan/})
doWithFeatureArray(managementPlan, managementPlan.data.managementPlans, 'sitesCoveredByPlan')

var revegHabitat = db.output.findOne({activityId:reportActivityId, name:/Revegetating habitat/})
doWithFeatureArray(revegHabitat, revegHabitat.data.revegetationArea, 'sitesRevegetated')

var floraSurvey = db.output.findOne({activityId:reportActivityId, name:/Flora survey/})
doWithFeatureArray(floraSurvey, floraSurvey.data.floraSurveys, 'sitesSurveyed')

var weedTreatment = db.output.findOne({activityId:reportActivityId, name:/Weed treatment/})
doWithFeatureArray(weedTreatment, weedTreatment.data.weedTreatmentSites, 'sitesTreated')

var weedDistribution = db.output.findOne({activityId:reportActivityId, name:/Weed distribution/})
doWithFeatureArray(weedDistribution, weedDistribution.data.weedDistributionSurveySites, 'sitesSurveyed')



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

    db.output.save(output);
    audit(output, output.outputId, 'au.org.ala.ecodata.Output', adminUserId)

    db.site.save(site);
    audit(site, site.siteId, 'au.org.ala.ecodata.Site', adminUserId)
}
