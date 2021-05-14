package pages.modules

import geb.Module

class RlpOverviewTab extends Module {
    static content = {
        program { $('.overview .row .col-sm-8 div', text:'Program').siblings()[0] }
        managementUnit { $('.overview .row .col-sm-8 div', text:'Management Unit').siblings()[0] }
        serviceProvider { $('.overview .row .col-sm-8 div', text:'Service Provider').siblings()[0] }
        projectId { $('.overview .row .col-sm-8 div', text:'Project ID').siblings()[0] }
        status { $('.overview .row .col-sm-8 div', text:'Project status').siblings()[0] }
        projectStart { $('.overview .row .col-sm-8 div', text:'Project start').siblings()[0] }
        projectEnd { $('.overview .row .col-sm-8 div', text:'Project end').siblings()[0] }
        funding { $('.overview .row .col-sm-8 div', text:'Project Funding').siblings()[0] }
        internalOrderNumber { $('.overview .row .col-sm-8 div', text:'Internal order number').siblings()[0]}

        description { $('p[data-bind*=description]') }
        newsAndEvents { $('div', text:'').siblings()[0] }
        stories { $('div', text:'').siblings()[0] }


        // bootsrap 4
        programName {$(".programName")}
        managementUnitName {$(".managementUnitName")}
        serviceProviderName {$(".organisationName")}
        projectIds {$(".projectId")}
        projectStatus {$(".projectStatus")}
        projectStartDate {$(".projectStartDate")}
        projectEndDate {$(".projectEndDate")}
        projectFundingAmount {$(".projectFunding")}
        iONumber {$(".internalOrderNumber")}
        projectDescription {$(".projectDescription")}
    }

}
