package pages.modules

import geb.Module

class RlpOverviewTab extends Module {
    static content = {

        programName {$(".programName")}
        managementUnitName {$(".managementUnitName")}
        serviceProviderName {$(".organisationName")}
        projectIds {$(".projectId")}
        projectStatus {$(".projectStatus")}
        projectStartDate {$(".projectStartDate")}
        projectEndDate {$(".projectEndDate")}
        projectFundingAmount {$(".projectFunding")}
        internalOrderIds {$(".internalOrderNumber")}
        description {$(".projectDescription")}

        newsAndEvents { $('div', text:'').siblings()[0] }
        stories { $('div', text:'').siblings()[0] }


    }

}
