package pages.modules

import geb.Module
import geb.module.FormElement

class MeriPlanApproveDialog extends Module {
    static content = {

        changeOrderNumbers { $('#meri-plan-approval-document-reference') }
        comment { $('#meri-plan-approval-reason') }

        approvePlanButton{ $('button[data-bind*=referenceDocument]') }
    }

    def approve() {
        // Click the header to move focus away from any input fields to trigger the knockout update
        // to enable the button if necessary.
        $('.modal-header h4').click()
        waitFor { approvePlanButton.module(FormElement).enabled }
        approvePlanButton.click()
    }
}
