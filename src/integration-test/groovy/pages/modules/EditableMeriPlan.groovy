package pages.modules

import geb.Module
import geb.module.Checkbox
import geb.module.FormElement
import org.openqa.selenium.StaleElementReferenceException

class OutcomeRow extends Module {
    static content = {
        outcome { $('.outcome-priority select') }
        priority { $('.priority select') }
        remove { $('i.icon-remove') }
        priorityUnstyle{$('.list-unstyled')}
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
        method { $('.baseline-method textarea[data-bind*=method]') }
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
        otherOrgType { $('.partner-organisation-type input').module(FormElement) }
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
        total { $('.budget-amount.budget-total span') }
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
        date(required:false) { $('.target-date input') }
        targets { $('.budget-cell input') }
    }

    void selectService(String value) {
        waitFor {
            def options = $('.service option').collect{it.text() }
            boolean found = options.contains(value)
            if (!found) {
                println "Option '$value' not found.  Options: are $options"
            }
            found
        }
        service = value
    }

    void selectScore(String value) {
        waitFor {
            def options = $('.score option').collect{it.text() }
            options.contains(value)
        }
        score = value
    }
}

class ObjectivesAndAssets extends Module {
    static content = {
        outcome { $('.original-outcomes textarea') }
        assets { $('.original-assets select') }
        removeButton(required:false) { $('.remove i') }
    }
    void remove() {
        removeButton.click()
    }
}

class SubmissionModal extends Module {
    static content = {
        cancelButton { $('.btn.btn-danger') }
    }

    void cancel() {
        cancelButton.click()
    }
}

class ControlApproachRow extends Module {
    static content = {
        approach { $('.approach-current select[data-bind*=couldBethreatToSpecies]') }
        details { $('.approach-details textarea[data-bind*=details]') }
    }
}

class ControlMethodRow extends Module {
    static content = {
        current { $('.method-current textarea[data-bind*=currentControlMethod]') }
        success { $('.method-success select[data-bind*=hasBeenSuccessful]') }
        type { $('.method-type select[data-bind*=methodType]') }
        details { $('.method-details textarea[data-bind*=details]') }
        remove { $('i.icon-remove') }
    }
}

class EditableMeriPlan extends Module {


    static content = {
        primaryOutcome(required: false) { $('.outcome-priority select[data-bind*="primaryOutcome.description"]') }
        primaryPriority(required: false) { $('select[data-bind*="primaryOutcome.asset"]') }
        primaryPriorityUnstyled(required: false) {$('.priority li label')}

        assetType(required: false) {$('.asset-category select')}
        asset(required: false) {$('.asset-detail select[data-bind*="description"]')}
        otherOutcomeColumn1(required: false) {$('.column-1 li label')}
        otherOutcomeColumn2(required: false) {$('.column-2 li label')}
        secondaryOutcomes(required: false) { $('table.secondary-outcome tbody tr').moduleList(OutcomeRow) }
        shortTermOutcomes(required: false) { $('tbody[data-bind*="shortTermOutcomes"] textarea') }
        mediumTermOutcomes(required: false) {  $('tbody[data-bind*="midTermOutcomes"] textarea') }
        addMediumTermOutcomeButton(required:false) { $('button[data-bind*="addMidTermOutcome"]') }
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
        projectPartnerships(required: false) { $('#project-partnership tbody tr').moduleList(PartnershipRow) }
        keq(required:false) { $('#keq tbody tr').moduleList(KeqRow) }
        budget(required:false) { $('.meri-budget').moduleList(BudgetRow) }
        activities(required:false) { $('#activity-list') }
        assets(required:false) { $('table.assets tbody tr').moduleList(AssetRow) }
        adaptiveManagement(required:false) { $('#adaptive-management textarea') }
        otherObjective(required:false) { $('#objectives-list input[type=text]') }
        otherActivity(required:false) { $('#activity-list input[type=text]') }
        consultation(required:false) { $('.consultation textarea') }
        communityEngagement(required:false) { $('.community-engagement textarea') }
        relatedProjects(required:false) { $('.related-projects textarea') }
        objectivesAndAssets(required:false) { $('table tbody[data-bind*="objectives.rows1"] tr').moduleList(ObjectivesAndAssets) }
        controlMethods(required: false) { $('table.control-method tbody tr').moduleList(ControlMethodRow) }
        controlApproaches(required: false) { $('table.control-approach-threat tbody tr').moduleList(ControlApproachRow) }

        floatingSaveButton { $('#floating-save [data-bind*="saveProjectDetails"]') }
        saveButton { $('.form-actions [data-bind*="saveProjectDetails"]').first() }
        pdfButton { $('.btn[data-bind*="meriPlanPDF"]').first() }
        saveAndSubmitChanges { $('button.saveAndSubmitChanges').first() }
        approveButton(required:false){ $('[data-bind*="approvePlan"]') }
        rejectButton(required:false) { $('[data-bind*="rejectPlan"]') }
        modifyApprovedPlanButton(required:false){ $('[data-bind*="modifyPlan"]') }

        approvePlanDialog(required:false) { $('#meri-plan-approval-modal').module(MeriPlanApproveDialog) }

        externalIds {$('.externalIds').module(ExternalIds)}
        projectStartDate(required:false) { $('#changeProjectStartDate') }
        submissionModal(required:false) { $("#meriSubmissionDeclaration").module(SubmissionModal) }
    }

    void addBudgetRow() {
        int currentRows = budget.size()
        $('button[click*=addBudget]').click()

        waitFor {
            budget.size() == currentRows + 1
        }
    }

    void addPartnershipRow() {
        int currentRows = projectPartnerships.size();
        $('button[data-bind*=addPartnership]').click();
        waitFor {
            projectPartnerships.size() == currentRows + 1
        }
    }

    void addObjectiveAndAssetRow() {
        int currentRows = objectivesAndAssets.size();
        $('button[data-bind*=addOutcome]').click();
        waitFor {
            objectivesAndAssets.size() == currentRows + 1
        }
    }

    void hideFloatingSave() {
        js.exec("\$('#floating-save').css('display', 'none');")
    }

    boolean floatingSaveDisplayed() {
        $("#floating-save").size() > 0 && $("#floating-save").displayed
    }

    void save() {
        saveButton.click()
        // There is a chance of a race condition here if the save
        // finishes before this check runs, hence catching the assertion
        try {
            waitFor(5, 0.1) { $('.blockMsg').displayed }
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

    void submit() {
        if (saveAndSubmitChanges.module(FormElement).enabled) {
            saveAndSubmitChanges.click()
        }
        else {
            throw new RuntimeException("Submit button is disabled")
        }
    }

    List selectablePrimaryOutcomes() {
        primaryOutcome.find('option').collect{it.attr("value")}
    }

    List selectableSecondaryOutcomes() {
        secondaryOutcomes[0].outcome.find('option').collect{it.attr("value")}
    }

    List availableObjectives() {
        objectivesList.find('input[type="checkbox"]').collect{it.attr("value")}
    }

    void checkObjective(String value) {
        def checkbox = objectivesList.find("input[value=\"${value}\"]").module(Checkbox)
        checkbox.check()
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
