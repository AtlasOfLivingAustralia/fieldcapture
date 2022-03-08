package pages.modules

import geb.Module

class RlpOverviewTab extends Module {
    static content = {

        program {$(".programName")}
        managementUnitName {$(".managementUnitName")}
        serviceProviderName {$(".organisationName")}
        projectId {$(".projectId")}
        status {$(".projectStatus")}
        startDate {$(".projectStartDate")}
        endDate {$(".projectEndDate")}
        projectFundingAmount {$(".projectFunding")}
        internalOrderIds {$(".internalOrderNumber")}
        description {$(".projectDescription")}

        newsAndEvents { $('div', text:'').siblings()[0] }
        stories { $('div', text:'').siblings()[0] }


    }

}
