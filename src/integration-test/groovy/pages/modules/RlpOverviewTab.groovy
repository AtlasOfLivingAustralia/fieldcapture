package pages.modules

import geb.Module

class RlpOverviewTab extends Module {
    static content = {
        program { $('.overview div.programName') }
        managementUnit { $('.overview div.managementUnitName') }
        serviceProvider { $('.overview div.organisationName').siblings()[0] }
        projectId { $('.overview div.projectId') }
        status { $('.overview span.projectStatus.badge-info') }
        projectStart { $('.overview div.projectStartDate span') }
        projectEnd { $('.overview div.projectStartDate span') }
        funding { $('.overview div.projectFunding span') }
        internalOrderNumber { $('.overview div.internalOrderNumber') }

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
