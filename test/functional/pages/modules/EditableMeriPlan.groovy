package pages.modules

import geb.Module

class OutcomeRow extends Module {
    static content = {
        outcome { $('select[data-bind*="value:description"]') }
        priority { $('select[data-bind*="value:asset"]') }
    }
}
class EditableMeriPlan extends Module {


    static content = {
        primaryOutcome { $('.outcome-priority select[data-bind*="primaryOutcome.description"]') }
        primaryPriority { $('select[data-bind*="primaryOutcome.asset"]') }
        secondaryOutcomes { $('table.secondary-outcome').moduleList(OutcomeRow) }
        shortTermOutcomes { $('tbody[data-bind*="shortTermOutcomes"] textarea') }
        mediumTermOutcomes {  $('tbody[data-bind*="midTermOutcomes"] textarea') }
        projectName {}
        projectDescription {}
        keyThreats {}
        projectMethodology {}
        projectBaseline {}
        monitoringIndicators {}
        reviewMethodology {}
        nationalAndRegionalPlans {}
        projectServices {}
        risksAndThreats {}

        floatingSaveButton { $('#floating-save [data-bind*="saveProjectDetails"]') }
        saveButton { $('.form-actions [data-bind*="saveProjectDetails"]').first() }
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
        waitFor { !$('.blockMsg').displayed }
    }
}
