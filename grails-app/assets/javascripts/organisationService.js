function OrganisationService(organisation, options) {
    var self = this;
    var defaults = {
        excludeFinancialYearData : false
    };

    var config = _.defaults(options, defaults);

    self.getBudgetHeaders = function() {
        if (config.excludeFinancialYearData) {
            return []; // Return a single period header for the organisation
        }
        var headers = [];
        var startYr = moment(organisation.plannedStartDate).format('YYYY');
        var endYr = moment(organisation.plannedEndDate).format('YYYY');
        var startMonth = moment(organisation.plannedStartDate).format('M');
        var endMonth = moment(organisation.plannedEndDate).format('M');

        //Is startYr is between jan to june?
        if(startMonth >= 1 &&  startMonth <= 6 ){
            startYr--;
        }

        //Is the end year is between july to dec?
        if(endMonth >= 7 &&  endMonth <= 12 ){
            endYr++;
        }

        var count = endYr - startYr;
        for (i = 0; i < count; i++){
            headers.push(startYr + '/' + ++startYr);
        }

        return headers;
    };
}