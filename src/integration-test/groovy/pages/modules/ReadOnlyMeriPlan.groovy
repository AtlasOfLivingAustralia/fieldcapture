package pages.modules

import geb.Module
import org.openqa.selenium.StaleElementReferenceException

class ReadOnlyOutcomeRow extends Module {
    static content = {
        outcome { $('.outcome-priority span') }
        priority { $('.priority span') }
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
    }
}

class ReadOnlyServiceTargetRow extends Module {
    static content = {
        service { $('.service span') }
        score { $('.score span') }
        targets { $('.budget-cell span') }
    }
}

class ReadOnlyMeriPlan extends Module {


    static content = {
        primaryOutcome(required: false) { $('.primary-outcome .outcome-priority span') }
        primaryPriority(required: false) { $('.primary-outcome span[data-bind*=asset]') }
        secondaryOutcomes(required: false) { $('table.secondary-outcome tbody tr').moduleList(ReadOnlyOutcomeRow) }
        shortTermOutcomes(required: false) { $('tbody[data-bind*="shortTermOutcomes"] span') }
        mediumTermOutcomes(required: false) {  $('tbody[data-bind*="midTermOutcomes"] span') }
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
        budget(required:false) { $('.meri-budget').moduleList(ReadOnlyBudgetRow) }
        activities(required:false) { $('#activity-list') }
        assets(required:false) { $('table.assets-view tbody tr').moduleList(ReadOnlyAssetRow) }
        adaptiveManagement(required:false) { $('#adaptive-management-view span') }
    }

    List objectives() {
        $('#objectives-list-view li').collect{it.text()}
    }

    List activities() {
        $('#activity-list-view li').collect{it.text()}
    }

}
