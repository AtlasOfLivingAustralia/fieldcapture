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
        name { $('.partner-name span') }
        partnership { $('.partnership-nature span') }
        orgType { $('.partner-organisation-type span') }
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
        shortTermOutcomes(required: false) { $('tbody[data-bind*="shortTermOutcomes"] textarea') }
        mediumTermOutcomes(required: false) {  $('tbody[data-bind*="midTermOutcomes"] textarea') }
        addMediumTermOutcomeButton(required:false) { $('button[data-bind*="addMidTermOutcome"') }
        projectName(required: false) { $('input[data-bind*="details.name"]') }
        projectDescription(required: false) { $('textarea[data-bind*="details.description"]') }
        rationale(required: false) { $('textarea[data-bind*="details.rationale"]') }
        keyThreats(required: false) { $('table.threats-view tbody tr').moduleList(ReadOnlyThreatRow) }
        projectMethodology(required: false) { $('table span[data-bind*="implementation.description"]') }
        projectImplementation(required: false) { $('#project-implementation span') }
        projectBaseline(required: false) { $('table.baseline-view tbody tr').moduleList(ReadOnlyBaselineRow) }
        monitoringIndicators(required: false) { $('.meri-monitoring-indicators  table tbody tr').moduleList(ReadOnlyMonitoringIndictorRow) }
        rlpMonitoringIndicators(required: false) { $('table.monitoring-indicators-view tbody tr').moduleList(ReadOnlyMonitoringIndictorRow) }

        reviewMethodology(required: false) { $('span[data-bind*="projectEvaluationApproach"]') }
        nationalAndRegionalPlans(required: false) { $('table.plans-view tbody tr').moduleList(ReadOnlyPlanRow) }
        projectServices(required: false) { $('table.service-targets-view tbody tr').moduleList(ReadOnlyServiceTargetRow) }
        objectivesList(required: false) { $('#objectives-list') }
        projectPartnerships(required: false) { $('#project-partnership').moduleList(ReadOnlyPartnershipRow) }
        keq(required:false) { $('#keq tbody tr').moduleList(ReadOnlyKeqRow) }
        budget(required:false) { $('.meri-budget').moduleList(ReadOnlyBudgetRow) }
        activities(required:false) { $('#activity-list') }
        assets(required:false) { $('table.assets tbody tr').moduleList(ReadOnlyAssetRow) }
        adaptiveManagement(required:false) { $('#adaptive-management textarea') }
        otherObjective(required:false) { $('#objectives-list input[type=text]') }
        otherActivity(required:false) { $('#activity-list input[type=text]') }

        floatingSaveButton { $('#floating-save [data-bind*="saveProjectDetails"]') }
        saveButton { $('.form-actions [data-bind*="saveProjectDetails"]').first() }
        pdfButton { $('.btn[data-bind*="meriPlanPDF"').first() }
    }

    void hideFloatingSave() {
        js.exec("\$('#floating-save').css('display', 'none');")
    }

    void save() {
        saveButton.click()
        // There is a chance of a race condition here if the save
        // finishes before this check runs, hence catching the assertion
        try {
            waitFor(3, 0.1) { $('.blockMsg').displayed }
        }
        catch (Throwable e) {
            // Don't care, we just need the save to finish, the 3 second
            // timeout will allow this to happen.
        }
        waitFor {
            try {
                !$('.blockMsg').displayed
            }
            catch (StaleElementReferenceException e) {
                return true // This indicates a page reload
            }
        }
    }

    List availableObjectives() {
        objectivesList.find('input[type="checkbox"]').collect{it.attr("value")}
    }

    void checkObjective(String value) {
        objectivesList.find("input[value=\"${value}\"]").click()
    }

    void generatePDF() {
        pdfButton.click()
    }

    List checkedObjectives() {
        objectivesList.find('input:checked').collect{it.attr("value")}
    }

    List availableActivities() {
        activities.find('input[type="checkbox"]').collect{it.attr("value")}
    }

    void checkActivity(String value) {
        activities.find("input[value=\"${value}\"]").click()
    }

    List checkedActivities() {
        activities.find('input:checked').collect{it.attr("value")}
    }

    void addMediumTermOutcome(String outcome) {
        // If we don't do this, the click will hit the floating save instead of the
        // button.
        hideFloatingSave()

        int midTermOutcomeCount = mediumTermOutcomes.size()

        addMediumTermOutcomeButton.click()
        waitFor{ mediumTermOutcomes.size() > midTermOutcomeCount }

        mediumTermOutcomes[midTermOutcomeCount].value(outcome)
    }


}
