var scores = db.score.find({category:'RLP'});
var rlpFormSections = db.activityForm.distinct('sections.name', {name:"RLP Output Report"});
var siFormSections = db.activityForm.distinct('sections.name', {name:"State Intervention Progress Report"})
while (scores.hasNext()) {
    var score = scores.next();
    //print(score.label);
    var match = false;
    for (var i=0; i<score.configuration.childAggregations.length; i++) {
        var section =  score.configuration.childAggregations[i];
        if (section.filter && rlpFormSections.indexOf(section.filter.filterValue) >= 0) {
            var siFilter = section.filter.filterValue.substring(6);
            //print(siFilter);
            if (siFormSections.indexOf(siFilter) < 0) {
                print("Filtler doens't match: "+section.filter.filterValue);
            }
            else {
                var siSection = {
                    filter: {
                        "filterValue": siFilter,
                        "property": section.filter.property,
                        "type": section.filter.type
                    },
                    childAggregations: section.childAggregations
                };

                score.configuration.childAggregations.push(siSection);

                match = true;
                //print("Match");
                db.score.save(score);
                break;
            }


        }

    }
    if (!match) {

        print("No match for "+score.label);
    }

}

