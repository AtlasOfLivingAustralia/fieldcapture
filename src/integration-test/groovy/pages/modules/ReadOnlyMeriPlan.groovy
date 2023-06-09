package pages.modules

import geb.Module
import org.openqa.selenium.StaleElementReferenceException

class ReadOnlyOutcomeRow extends Module {
    static content = {
        outcome { $('.outcome-priority span') }
        priority { $('.priority span') }
    }
}

class ReadOnlyProjectOutcomeRow extends Module {
    static content = {
        outcome { $('.outcome span') }
        priority(required:false) { $('.investment-priority span') }
        relatedProgramOutcomes(required: false) { $('.program-outcome span') }
    }
}

class ReadOnlyThreatRow extends Module {
    static content = {
        threat { $('span[data-bind*=threat]') }
        intervention { $('span[data-bind*=intervention]') }
    }
}

class ReadOnlyBaselineRow extends Module {
    static content = {
        baseline { $('.baseline span[data-bind*=baseline]') }
        method { $('.baseline-method span') }
    }

}

class ReadOnlyMonitoringIndictorRow extends Module {
    static content = {
        indicator { $('span[data-bind*=data1]') }
        approach { $('span[data-bind*=data2]' ) }
    }
}

class ReadOnlyPlanRow extends Module {
    static content = {
        name { $('.document-name span') }
        section { $('.section span') }
        alignment { $('.alignment span') }
    }
}

class ReadOnlyPartnershipRow extends Module {
    static content = {
        name { $('.partner-name span').text() }
        partnership { $('.partnership-nature label').text() }
        orgType { $('.partner-organisation-type label').text() }
    }
}

class ReadOnlyKeqRow extends Module {
    static content = {
        question { $('.baseline span') }
        monitoring { $('.baseline-method span') }
    }
}

class ReadOnlyBudgetRow extends Module {
    static content = {
        area { $('.budget-category span') }
        description { $('.budget-description span') }
        budgetAmounts { $('.budget-amount span') }
        total { $('.budget-amount span') }
    }
}

class ReadOnlyAssetRow extends Module {
    static content = {
        description { $('td.asset span') }
        asset { $('td.asset-detail span') }
        assetType { $('td.asset-category span') }
    }
}

class ReadOnlyServiceTargetRow extends Module {
    static content = {
        service { $('.service span') }
        score { $('.score span') }
        targets { $('.budget-cell span') }
        date(required:false) { $('.target-date span') }

    }
}


/**
 * A module representing the Priority Place section of the MERI plan.
 */
class ReadOnlyPriorityPlace extends Module {
    static content = {
        supportsPriorityPlaces { $('#supports-priority-place') }
        priorityPlace { $('#priority-place') }
    }
}

/**
 * A module representing the First Nations People Involvement section of the MERI plan.
 */
class ReadOnlyFirstNationsPeopleInvolvement extends Module {
    static content = {
        supportsFirstNationsPeopleInvolvement { $('#indigenous-involved') }
        firstNationsPeopleInvolvement { $('#indigenous-involvement') }
        comments { $('#indigenous-involvement-comments') }
    }
}

class ReadOnlyServiceOutcomeTarget extends Module {
    static content = {
        outcomes { $('.service select') }
        target { $('.score input') }
    }
}
class ReadOnlyServiceOutcomeTargets extends Module {
    static content = {
        service { $('.service input') }
        targetMeasure { $('.score input') }
    }
}

class ReadOnlyServiceOutcomes extends Module {
    static content = {

        serviceAndTargets(required:false) { $('tr.service-target').moduleList(ServiceOutcomeTargets) }
        outcomeTargets(required:false) { $('tr.outcome-target').moduleList(ServiceOutcomeTarget) }
    }
}

class ReadOnlyServiceForecasts extends Module {
    static content = {
        forecasts(required:false) { $('tbody tr').moduleList(ForecastRow) }
    }
}

class ReadOnlyForecastRow extends Module {
    static content = {
        service { $('.service input') }
        score { $('.score input') }
        targets { $('.budget-cell input') }
    }
}


class ReadOnlyMeriPlan extends Module {


    static content = {
        priorityPlace(required: false) { module(ReadOnlyPriorityPlace) }
        firstNationsPeopleInvolvement(required: false) { module(ReadOnlyFirstNationsPeopleInvolvement) }
        primaryOutcome(required: false) { $('.primary-outcome .outcome-priority span') }
        primaryPriority(required: false) { $('.primary-outcome span[data-bind*=asset]') }
        secondaryOutcomes(required: false) { $('table.secondary-outcome tbody tr').moduleList(ReadOnlyOutcomeRow) }
        shortTermOutcomes(required: false) { $('tbody[data-bind*="shortTermOutcomes"] tr').moduleList(ReadOnlyProjectOutcomeRow) }
        mediumTermOutcomes(required: false) {  $('tbody[data-bind*="midTermOutcomes"] tr').moduleList(ReadOnlyProjectOutcomeRow) }
        projectName(required: false) { $('input[data-bind*="details.name"]') }
        projectDescription(required: false) { $('span[data-bind*="details.description"]') }
        rationale(required: false) { $('textarea[data-bind*="details.rationale"]') }
        keyThreats(required: false) { $('table.threats-view tbody tr').moduleList(ReadOnlyThreatRow) }
        projectMethodology(required: false) { $('table span[data-bind*="implementation.description"]') }
        projectImplementation(required: false) { $('#project-implementation span') }
        projectBaseline(required: false) { $('table.baseline-view tbody tr').moduleList(ReadOnlyBaselineRow) }
        monitoringIndicators(required: false) { $('table.meri-monitoring-indicators tbody tr').moduleList(ReadOnlyMonitoringIndictorRow) }
        rlpMonitoringIndicators(required: false) { $('table.monitoring-indicators-view tbody tr').moduleList(ReadOnlyMonitoringIndictorRow) }

        reviewMethodology(required: false) { $('span[data-bind*="projectEvaluationApproach"]') }
        nationalAndRegionalPlans(required: false) { $('table.plans-view tbody tr').moduleList(ReadOnlyPlanRow) }
        projectServices(required: false) { $('table.service-targets-view tbody tr').moduleList(ReadOnlyServiceTargetRow) }
        objectivesList(required: false) { $('#objectives-list') }
        projectPartnerships(required: false) { $('#project-partnership-view tbody tr').moduleList(ReadOnlyPartnershipRow) }
        keq(required:false) { $('#keq tbody tr').moduleList(ReadOnlyKeqRow) }
        budget(required:false) { $('.meri-budget-view tbody tr').moduleList(ReadOnlyBudgetRow) }
        activities(required:false) { $('#activity-list') }
        assets(required:false) { $('table.assets-view tbody tr').moduleList(ReadOnlyAssetRow) }
        adaptiveManagement(required:false) { $('#adaptive-management-view span') }
        priorityAction(required:false) { $("#activity-list-view .activity") }
        relatedProjects(required:false) { $("span.relatedProjects") }
        consultation(required:false) { $(".consultation-view span") }
    }

    List objectives() {
        $('#objectives-list-view li').collect{it.text()}
    }

    List activities() {
        $('#activity-list-view li').collect{it.text()}
    }

}
