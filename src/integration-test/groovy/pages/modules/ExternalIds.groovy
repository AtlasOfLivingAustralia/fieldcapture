package pages.modules

import geb.Module

class ExternalId extends Module {
    static content = {
        idTypeSelect {$('select[name=idType]')}
        externalIdInput {$('input[name=externalId]')}
        remove {$('[data-bind*=removeExternalId')}
    }

    String getExternalId() {
        externalIdInput.value()
    }

    void setExternalId(String newExternalId) {
        externalIdInput.value(newExternalId)
    }

    String getIdType() {
        idTypeSelect.value()
    }

    void setIdType(String idType) {
        idTypeSelect.value(idType)
    }

    void remove() {
        remove.click()
    }
}

class ExternalIds extends Module {
    static content = {
        externalIds {$('.idList li').moduleList(ExternalId)}
        addExternalIdButton {$('[data-bind*=addExternalId]')}
    }

    List idsByType(String type) {
        externalIds.findAll{it.idType() == type}.collect{it.externalId()}
    }

    ExternalId addExternalId() {
        int count = externalIds.size()
        addExternalIdButton.click()
        waitFor {
            externalIds.size() == count+1
        }
        return externalIds[externalIds.size()-1]
    }
}
