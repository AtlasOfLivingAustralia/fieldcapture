package pages.modules

import geb.Module
import geb.module.Checkbox
import geb.module.FormElement
import org.openqa.selenium.StaleElementReferenceException

class OutcomeRow extends Module {
    static content = {
        outcome { $('.outcome-priority select') }
        priority { $('.priority select') }
        remove { $('i.fa-remove') }
        priorityUnstyle{$('.list-unstyled')}
    }
}

class ProjectOutcomeRow extends Module {
    static content = {
        outcome { $('.outcome textarea') }
        priority(required:false) { $('.investment-priority select') }
        relatedProgramOutcomes(required: false) { $('.program-outcome select') }
        remove(required:false) { $('i.fa-remove') }
    }

    void remove() {
        remove.click()
    }
}

class ThreatRow extends Module {
    static content = {
        threatCode(required:false) { $('.threat-code select') }
        threat { $('textarea[data-bind*=threat]') }
        intervention { $('textarea[data-bind*=intervention]') }
        targetMeasures(required:false) { $('.services select') }
        evidence(required:false) { $('.evidence textarea') }
        relatedOutcomes(required:false) { $('.related-outcomes select') }

        remove { $('i.icon-remove') }
    }
}

/**
 * Represents the extendedBaselineMonitoring.gsp MERI plan section tha build a relationship between the
 * project baseline and the monitoring indicators for that baseline.
 */
class ExtendedBaseline extends Module {
    static content = {
        projectBaselines(required: false) { $('tr.baseline-row').moduleList(BaselineRow) }
        monitoringIndicators(required: false) { $('.meri-monitoring-indicators  table tbody tr').moduleList(MonitoringIndicatorRow) }
        addMonitoringIndicatorButtons(required:false) { $('button[data-bind*=addMonitoringIndicator]') }

    }

    void addMonitoringIndicator(int baselineIndex) {
        addMonitoringIndicatorButtons[baselineIndex].click()
    }

    void addBaseline() {
        $('button[data-bind*=addRow]').click()
    }

}

class BaselineRow extends Module {
    static content = {
        outcome(required: false) { $('.outcome select') }
        monitoringData(required: false) { $('.monitoring-data select') }
        baseline { $('.baseline textarea[data-bind*=baseline]') }
        targetMeasures(required:false) { $('.service select') }
        method { $('.baseline-method textarea[data-bind*=method]') }
        evidence(required:false) { $('.baseline-evidence textarea') }
        methodProtocols(required:false) { $('.baseline-method select') }
        remove { $('i.icon-remove') }
    }
}

class MonitoringIndicatorRow extends Module {
    static content = {
        indicator { $('textarea[data-bind*=data1]') }
        approach { $('textarea[data-bind*=data2]' ) }
        targetMeasures(required:false) { $('.monitoring-service select') }
        evidence(required:false) { $('.monitoring-evidence textarea') }
        methodProtocols(required:false) { $('.monitoring-method select') }
        remove { $('i.icon-remove') }
    }
}

class PlanRow extends Module {
    static content = {
        name { $('.document-name textarea') }
        section { $('.section textarea') }
        alignment { $('.alignment textarea') }
        documentUrl {$('.document-url input')}
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


/**
 * A module representing the Priority Place section of the MERI plan.
 */
class PriorityPlace extends Module {
    static content = {
        supportsPriorityPlaces { $('#supports-priority-place') }
        priorityPlace { $('#priority-place') }
    }
}

/**
 * A module representing the First Nations People Involvement section of the MERI plan.
 */
class FirstNationsPeopleInvolvement extends Module {
    static content = {
        supportsFirstNationsPeopleInvolvement { $('#indigenous-involved') }
        firstNationsPeopleInvolvement { $('#indigenous-involvement') }
        comments { $('#indigenous-involvement-comments') }
    }
}

class ServiceOutcomeTarget extends Module {
    static content = {
        outcomes { $('.service select') }
        target { $('.score input') }
    }
}
class ServiceOutcomeTargets extends Module {
    static content = {
        service { $('.service input') }
        targetMeasure { $('.score input') }
    }
}

class ServiceOutcomes extends Module {
    static content = {

        serviceAndTargets(required:false) { $('tr.service-target').moduleList(ServiceOutcomeTargets) }
        outcomeTargets(required:false) { $('tr.outcome-target').moduleList(ServiceOutcomeTarget) }
    }
}

class ServiceForecasts extends Module {
    static content = {
        forecasts(required:false) { $('tbody tr').moduleList(ForecastRow) }
    }
}

class ForecastRow extends Module {
    static content = {
        service { $('.service input') }
        score { $('.score input') }
        targets { $('.budget-cell input') }
    }
}

class EditableMeriPlan extends Module {

    static content = {
        priorityPlace(required: false) { module(PriorityPlace) }
        firstNationsPeopleInvolvement(required: false) { module(FirstNationsPeopleInvolvement) }
        primaryOutcome(required: false) { $('.outcome-priority select[data-bind*="primaryOutcome.description"]') }
        primaryPriority(required: false) { $('select[data-bind*="primaryOutcome.asset"]') }
        primaryPriorityUnstyled(required: false) {$('.priority li label')}

        assetType(required: false) {$('.asset-category select')}
        asset(required: false) {$('.asset-detail select[data-bind*="description"]')}
        otherOutcomeColumn1(required: false) {$('.column-1 li label')}
        otherOutcomeColumn2(required: false) {$('.column-2 li label')}
        secondaryOutcomes(required: false) { $('table.secondary-outcome tbody tr').moduleList(OutcomeRow) }
        shortTermOutcomes(required: false) { $('tbody[data-bind*="shortTermOutcomes"] tr').moduleList(ProjectOutcomeRow) }
        addShortTermOutcomeButton(required:false) { $('button[data-bind*="addShortTermOutcome"]') }
        mediumTermOutcomes(required: false) {  $('tbody[data-bind*="midTermOutcomes"] tr').moduleList(ProjectOutcomeRow) }
        addMediumTermOutcomeButton(required:false) { $('button[data-bind*="addMidTermOutcome"]') }
        projectName(required: false) { $('input[data-bind*="details.name"]') }
        projectDescription(required: false) { $('textarea[data-bind*="details.description"]') }
        rationale(required: false) { $('textarea[data-bind*="details.rationale"]') }
        keyThreats(required: false) { $('table.threats tbody tr').moduleList(ThreatRow) }
        projectMethodology(required: false) { $('table.methodology textarea[data-bind*="implementation.description"]') }
        projectImplementation(required: false) { $('#project-implementation textarea') }
        projectBaseline(required: false) { $('table.monitoring-baseline tbody tr').moduleList(BaselineRow) }
        extendedBaseline(required:false) { $('table.monitoring-baseline.extended').module(ExtendedBaseline) }
        monitoringIndicators(required: false) { $('.meri-monitoring-indicators  table tbody tr').moduleList(MonitoringIndicatorRow) }
        rlpMonitoringIndicators(required: false) { $('table.monitoring tbody tr').moduleList(MonitoringIndicatorRow) }
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
        serviceOutcomeTargets(required: false) { $('table.service-outcomes-targets').module(ServiceOutcomes) }
        serviceForecasts(required: false) { $('table.forecasts').module(ServiceForecasts) }
        floatingSaveButton { $('#floating-save [data-bind*="saveProjectDetails"]') }
        saveButton { $('.form-actions [data-bind*="saveProjectDetails"]').first() }
        pdfButton { $('.btn[data-bind*="meriPlanPDF"]').first() }
        meriPlanChanges { $('.btn[data-bind*="meriPlanChanges"]').first() }
        saveAndSubmitChanges { $('button.saveAndSubmitChanges').first() }
        approveButton(required:false){ $('[data-bind*="approvePlan"]') }
        rejectButton(required:false) { $('[data-bind*="rejectPlan"]') }
        modifyApprovedPlanButton(required:false){ $('[data-bind*="modifyPlan"]') }

        approvePlanDialog(required:false) { $('#meri-plan-approval-modal').module(MeriPlanApproveDialog) }

        externalIds {$('.externalIds').module(ExternalIds)}
        projectStartDate(required:false) { $('#changeProjectStartDate') }
        submissionModal(required:false) { $("#meriSubmissionDeclaration").module(SubmissionModal) }

        toggleMeriPlanHistory(required:false){ $('[data-bind*="toggleMeriPlanHistory"]') }
        meriPlanHistory {module HistoryApprovedMeriPlansModule}
        compareMeriPlanChanges(required:false){ $('[data-bind*=meriPlanChanges]') }
        lockMeriPlanButton (required:false) { $('#lockMeriPlan') }

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

    void unapprovePlan() {
        modifyApprovedPlanButton.click()
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

    void compareMeriPlanChanges() {
        meriPlanChanges.click()
    }

    List checkedObjectives() {
        objectivesList.find('input:checked').collect{it.attr("value")}
    }

    List availableActivities() {
        activities.find('input[type="checkbox"]').collect{it.attr("value")}
    }

    void checkActivity(String value) {
        activities.find("input[value=\"${value}\"]").module(Checkbox).check()
    }

    List checkedActivities() {
        activities.find('input:checked').collect{it.attr("value")}
    }

    void addMediumTermOutcome(String outcome, String investmentPriority = null, String relatedProgramOutcome = null) {
        // If we don't do this, the click will hit the floating save instead of the
        // button.
        hideFloatingSave()

        int midTermOutcomeCount = mediumTermOutcomes.size()

        addMediumTermOutcomeButton.click()
        waitFor{ mediumTermOutcomes.size() > midTermOutcomeCount }

        mediumTermOutcomes[midTermOutcomeCount].outcome.value(outcome)
        if (investmentPriority) {
            mediumTermOutcomes[midTermOutcomeCount].priority.value(investmentPriority)
        }
        if (relatedProgramOutcome) {
            mediumTermOutcomes[midTermOutcomeCount].relatedProgramOutcomes.value(relatedProgramOutcome)
        }
    }

    void addShortTermOutcome(String outcome, String investmentPriority = null, String relatedProgramOutcome = null) {
        // If we don't do this, the click will hit the floating save instead of the
        // button.
        hideFloatingSave()
        int midTermOutcomeCount = shortTermOutcomes.size()

        addShortTermOutcomeButton.click()
        waitFor{ shortTermOutcomes.size() > midTermOutcomeCount }

        shortTermOutcomes[midTermOutcomeCount].outcome.value(outcome)
        if (investmentPriority) {
            shortTermOutcomes[midTermOutcomeCount].investmentPriority.value(investmentPriority)
        }
        if (relatedProgramOutcome) {
            shortTermOutcomes[midTermOutcomeCount].relatedProgramOutcome.value(relatedProgramOutcome)
        }
    }

    /** Users of this method should waitFor hasBeenReloaded as this triggers a page reload */
    void aquireEditLock() {
        waitFor {
            lockMeriPlanButton.displayed
        }
        lockMeriPlanButton.click()
    }

    boolean holdsEditLock() {
        $('div.meri-lock-held').each {it.displayed}
    }

}
