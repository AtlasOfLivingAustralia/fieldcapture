package pages.modules

import geb.Module

class ProjectSiteModules extends Module {
    static content = {
        name{$('#name')}
        externalId{$("#externalId")}
        type{$("#siteType")}
        context{$("#siteContext")}
        description{$("#description")}
        notes{$("#notes")}
        defineExtent{$("#extentSource")}
        chooseLayer{$("#chooseLayer")}
        chooseShape {$("#chooseShape").moduleList(ChooseShapeMap)}
        saveButton(required:false) {$("#save")}
        cancel{$("#cancel")}
        latitude{$("input", "data-bind":"value:geometry().decimalLatitude")}
        longitude {$("input", "data-bind":"value:geometry().decimalLongitude")}
        uncertainty{$("input", "data-bind":"value:geometry().uncertainty")}
        percision{$("input", "data-bind":"value:geometry().precision")}
    }

    def save() {
        waitFor {saveButton.displayed}
        saveButton.click()
    }
}
