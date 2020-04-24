package pages.modules

import geb.Module
import org.openqa.selenium.StaleElementReferenceException

class OutcomeRow extends Module {
    static content = {
        outcome { $('.outcome-priority select') }
        priority { $('.priority select') }
        remove { $('i.icon-remove') }
    }
}

class ThreatRow extends Module {
    static content = {
        threat { $('textarea[data-bind*=threat]') }
        intervention { $('textarea[data-bind*=intervention]') }
        remove { $('i.icon-remove') }
    }
}

class BaselineRow extends Module {
    static content = {
        baseline { $('.baseline textarea[data-bind*=baseline]') }
        method { $('.baseline-method textarea[data-bind*=method') }
        remove { $('i.icon-remove') }
    }

}

class MonitoringIndictorRow extends Module {
    static content = {
        indicator { $('textarea[data-bind*=data1]') }
        approach { $('textarea[data-bind*=data2]' ) }
        remove { $('i.icon-remove') }
    }
}

class PlanRow extends Module {
    static content = {
        name { $('.document-name textarea') }
        section { $('.section textarea') }
        alignment { $('.alignment textarea') }
        remove { $('i.icon-remove') }
    }
}

class PartnershipRow extends Module {
    static content = {
        name { $('.partner-name textarea') }
        partnership { $('.partnership-nature textarea') }
        orgType { $('.partner-organisation-type select') }
        remove { $('i.icon-remove') }
    }
}

class KeqRow extends Module {
    static content = {
        question { $('.baseline textarea') }
        monitoring { $('.baseline-method textarea') }
        remove { $('i.icon-remove') }
    }
}

class BudgetRow extends Module {
    static content = {
        area { $('.budget-category select') }
        description { $('.budget-description textarea') }
        budgetAmounts { $('.budget-amount input') }
        total { $('.budget-amount span') }
        remove { $('i.icon-remove') }
    }
}

class AssetRow extends Module {
    static content = {
        description { $('td.asset textarea') }
        remove { $('i.icon-remove') }
    }
}
class ServiceTargetRow extends Module {
    static content = {
        service { $('.service select') }
        score { $('.score select') }
        targets { $('.budget-cell input') }
    }
}

class EditableMeriPlan extends Module {


    static content = {
        primaryOutcome(required: false) { $('.outcome-priority select[data-bind*="primaryOutcome.description"]') }
        primaryPriority(required: false) { $('select[data-bind*="primaryOutcome.asset"]') }
        secondaryOutcomes(required: false) { $('table.secondary-outcome tbody tr').moduleList(OutcomeRow) }
        shortTermOutcomes(required: false) { $('tbody[data-bind*="shortTermOutcomes"] textarea') }
        mediumTermOutcomes(required: false) {  $('tbody[data-bind*="midTermOutcomes"] textarea') }
        addMediumTermOutcomeButton(required:false) { $('button[data-bind*="addMidTermOutcome"') }
        projectName(required: false) { $('input[data-bind*="details.name"]') }
        projectDescription(required: false) { $('textarea[data-bind*="details.description"]') }
        rationale(required: false) { $('textarea[data-bind*="details.rationale"]') }
        keyThreats(required: false) { $('table.threats tbody tr').moduleList(ThreatRow) }
        projectMethodology(required: false) { $('table.methodology textarea[data-bind*="implementation.description"]') }
        projectImplementation(required: false) { $('#project-implementation textarea') }
        projectBaseline(required: false) { $('table.monitoring-baseline tbody tr').moduleList(BaselineRow) }
        monitoringIndicators(required: false) { $('.meri-monitoring-indicators  table tbody tr').moduleList(MonitoringIndictorRow) }
        rlpMonitoringIndicators(required: false) { $('table.monitoring tbody tr').moduleList(MonitoringIndictorRow) }

        reviewMethodology(required: false) { $('textarea[data-bind*="projectEvaluationApproach"]') }
        nationalAndRegionalPlans(required: false) { $('table.plans tbody tr').moduleList(PlanRow) }
        projectServices(required: false) { $('table.service-targets tbody tr').moduleList(ServiceTargetRow) }
        objectivesList(required: false) { $('#objectives-list') }
        projectPartnerships(required: false) { $('#project-partnership').moduleList(PartnershipRow) }
        keq(required:false) { $('#keq tbody tr').moduleList(KeqRow) }
        budget(required:false) { $('.meri-budget').moduleList(BudgetRow) }
        activities(required:false) { $('#activity-list') }
        assets(required:false) { $('table.assets tbody tr').moduleList(AssetRow) }
        adaptiveManagement(required:false) { $('#adaptive-management textarea') }
        otherObjective(required:false) { $('#objectives-list input[type=text]') }
        otherActivity(required:false) { $('#activity-list input[type=text]') }

        floatingSaveButton { $('#floating-save [data-bind*="saveProjectDetails"]') }
        saveButton { $('.form-actions [data-bind*="saveProjectDetails"]').first() }
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
