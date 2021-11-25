package pages.modules

import geb.Module

class RiskRow extends Module {
    static content = {
        type {$('.risk-type select')}
        description {$('.risk-description textarea')}
        likelihood {$('.risk-likelihood select')}
        consequence {$('.risk-consequence select')}
        rating {$('.risk-rating span')}
        control {$('.risk-control textarea')}
        residualRisk {$('.residual-risk select')}
    }
}
class RisksAndThreats extends Module {

    static content = {
        overallRisk {$('.ratingStyling select')}
        addRiskButton {$('button')}
        risks {$('tbody tr').moduleList(RiskRow)}
        saveButton {$('button[data-bind*="saveRisks"]')}
        cancelButton {$('#risks-cancel')}
    }

    void addRisk() {
        addRiskButton.click()
    }

    void save() {
        saveButton.click()
    }

    void cancel() {
        cancelButton.click()
    }

    void setRowData(int row, Map data) {
        risks[row].type = data.type
        risks[row].description = data.description
        risks[row].likelihood = data.likelihood
        risks[row].consequence = data.consequence
        risks[row].control = data.control
        risks[row].residualRisk = data.residualRisk
    }

    Map getRowData(int row) {
        [
                type: risks[row].type,
                description: risks[row].description,
                likelihood: risks[row].likelihood,
                consequence: risks[row].consequence,
                control: risks[row].control,
                residualRisk: risks[row].residualRisk
        ]
    }
}
