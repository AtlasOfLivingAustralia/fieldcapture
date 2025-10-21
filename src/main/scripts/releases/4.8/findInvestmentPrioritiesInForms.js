
// The following reports include investment priorities from the MERI plan which will need to be updated as well.
// * NHT Output Report
// * Grants and Others Progress Report
// * Procurement Output Report
// * RLP Short Term Outcomes
// * RLP Mid Term Outcomes
// * NHT Outcomes Report 1
// * NHT Outcomes Report 2

function findInvestmentPrioritiesInForms() {
    const reportTypes = [
        'RLP Short term project outcomes',
        'RLP Medium term project outcomes',

        'NHT Output Report',
        'Grants and Others Progress Report',
        'Procurement Output Report',
        'NHT Outcomes 1 Report',
        'NHT Outcomes 2 Report'
    ];
    let pathsByForm = [];
    for (let i=0; i<reportTypes.length; i++) {
        print("Processing reports of type " + reportTypes[i]);
        const reportType = reportTypes[i];

        const activityForms = db.activityForm.find({name:reportType, status:{$ne:'deleted'}});

        while (activityForms.hasNext()) {
            const activityForm = activityForms.next();

            let formPaths = {
                name: reportType,
                formVersion: activityForm.formVersion,
                sections: {}
            };
            pathsByForm.push(formPaths);

            print("Processing activity form " + activityForm.name + " v" + activityForm.formVersion);
            for (let j=0; j<activityForm.sections.length; j++) {
                const section = activityForm.sections[j];
                print("Processing form section " + section.name);
                let paths = [];
                formPaths.sections[section.name] = paths;

                function processNode(path, node) {
                    path = path.concat([node.name])
                    if (node.constraints && node.constraints.type == 'pre-populated') {
                        if (node.constraints.config.source && node.constraints.config.source['context-path'] == 'owner.investmentPriorities') {
                            paths.push(path);
                        }
                        else if (node.constraints.config.source && node.constraints.config.source.url) {

                            if (node.constraints.config.source.url.indexOf('listProjectInvestmentPriorities') >= 0) {
                                paths.push(path);
                            }
                        }
                    }
                    else if (node.dataType == 'list') {
                        for (let c=0; c<node.columns.length; c++) {
                            const column = node.columns[c];
                            processNode(path, column);
                        }
                    }
                }

                if (section.template['pre-populate']) {
                    const prepop = section.template['pre-populate'];
                    for (let k=0; k<prepop.length; k++) {
                        const node = prepop[k];
                        if (node.source && node.source.url && node.source.url.indexOf('listProjectInvestmentPriorities') >= 0) {

                        }
                    }
                }

                const dataModel = section.template['dataModel'];
                let node = null;
                for (let k=0; k<dataModel.length; k++) {
                    node = dataModel[k];
                    processNode([], node);
                }
            }
        }
    }
    return pathsByForm;

}
