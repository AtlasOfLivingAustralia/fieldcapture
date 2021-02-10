package pages.modules

import com.sun.media.jai.rmi.HashSetState
import geb.Module

class MeriPlanTabContent extends Module {

    static content = {
        assetType{$(".assets-view td.asset-category")}
        asset{$(".assets-view td.asset-detail")}
        priorityAction{$("#activity-list-view .activity")}
        outcomeStatements{$("table td.outcome")}
        description{$("span.description")}
        relatedProjects{$("span.relatedProjects")}
        consultation{$(".consultation-view span")}
        projectMethodology{$(".projectMethodology")}
        projectReview{$(".projectReview")}
        monitoringIndicatorsBaseline{$(".baseline")}
        monitoringIndicatorsBaselineMethod {$(".baseline-method") }

        nationalAndRegionalPlansName {$(".document-name")}
        nationalAndRegionalPlansSection {$(".section")}
        nationalAndRegionalPlansAlignment {$(".alignment")}
        keyThreatsThreats {$(".threats-view td.threat")}
        keyThreatsIntervention {$(".threats-view td.intervention")}

        ppPartnerName {$(".partner-name")}
        ppNature{$(".partnership-nature")}
        ppOrganisationType {$(".partner-organisation-type")}
        projectService {$(".service")}
        projectTargetMeasure {$(".score")}
        projectTotalDelivered {$(".budget-cell")}
        projectDeliveryDate {$(".target-date")}
        budgetDescription {$(".budget-description")}
        budgetAmount {$(".budget-amount")}
    }
}
