package pages.modules

import geb.Module

class DatasetPageModule extends Module{

    static content = {
        title(required: false) {$('#title')}
        programOutcome(required: false) {$('#programOutcome')}
        investmentPriorities(required: false) {$('#investmentPriority')}
        otherInvestmentPriority(required: false) {$(".otherPriorityTextArea")}
        term(required: false){$("#term")}
        type(required: false){$("#type")}
        measurementTypes(required: false) {$("#measurementTypes")}
        methods (required: false){$("#methods")}
        methodDescription (required: false) {$("#methodDescription")}
        collectionApp(required: false){$("#collectionApp")}
        location(required: false) {$('#location')}
        startDate(required: false) {$("#startDate")}
        endDate(required: false) {$("#endDate")}
        addition(required: false) {$("#addition")}
        collectorType(required: false){$('#collectorType')}
        qa(required: false) {$("#qa")}
        published(required: false) {$("#published")}
        storageType(required: false) {$("#storageType")}
        publicationUrl(required: false) {$("#publicationUrl")}
        format(required: false) {$("#format")}
        sensitivities(required: false) {$("#sensitivities")}
        dataOwner(required: false) {$("#owner")}
        custodian(required: false) {$("#custodian")}
        dataCollectionOngoing(required: false) {$("#dataCollectionOngoing")}
        dataCollectionOngoingChecked(required: false) {$("#dataCollectionOngoing:checked")}

        markCompleted(required: false) {$('[data-bind*="checked:markedAsFinished"]')}

        createButton{$("#save")}

        titleText(required: false) {$('#titleText')}
        programOutcomeText(required: false) {$('#programOutcomeText')}

    }

}
