/**
 * Iterates through a management unit project and managementUnit report configuration and adds a description
 * to any reports matching the supplied category.
 */
function addDescriptionToMUReports(category, description) {
    var mus = db.managementUnit.find({status:{$ne:'deleted'}});
    while (mus.hasNext()) {
        var mu = mus.next();

        if (mu.config.projectReports) {
            for (var i=0; i<mu.config.projectReports.length; i++) {
                if (mu.config.projectReports[i].category == category) {
                    mu.config.projectReports[i].description = description;
                    print("Updating report description for MU: "+mu.name);
                    db.managementUnit.save(mu);
                }
            }
        }
        if (mu.config.managementUnitReports) {
            for (var i=0; i<mu.config.managementUnitReports.length; i++) {
                if (mu.config.managementUnitReports[i].category == category) {
                    mu.config.managementUnitReports[i].description = description;

                    print("Updating report description for MU: "+mu.name);
                    db.managementUnit.save(mu);
                }
            }
        }

    }
}
