package pages.modules

import geb.Module

class OrganisationServiceTargetRow extends Module {
    static content = {
        service { $('td.service select') }
        targetMeasure { $('td.score select') }
        target { $('td.budget-cell input') }[0]
        dateBasedTargets { $('.date-based-targets input') }.subList(1)
    }
}

class OrganisationTargets extends Module {

    static content = {
        fundingAmounts { $('.funding table tbody input:not(first)') }
        serviceTargets { $('.service-targets table tbody row').moduleList(OrganisationServiceTargetRow) }
        saveButton {$('[data-bind*="saveCustomFields"]')}


    }

    def saveTargets() {
        saveButton.click()
    }

}
