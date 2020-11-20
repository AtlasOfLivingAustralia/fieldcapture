package pages.modules

import geb.Module

class MeriPlanApproveDialog extends Module {
    static content = {

        changeOrderNumbers { $('#meri-plan-approval-document-reference') }
        comment { $('#meri-plan-approval-reason') }

        approvePlanButton{ $('button[data-bind*=referenceDocument]') }
    }
}
