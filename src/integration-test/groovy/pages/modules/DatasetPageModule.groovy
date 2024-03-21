package pages.modules

import geb.Module
import geb.module.Checkbox

class DatasetPageModule extends Module{

    static content = {
        title {$('#title')}
        programOutcome {$('#programOutcome')}
        investmentPriorities {$('#investmentPriority')}
        serviceAndOutcomes {$('#projectOutcomes')}
        type{$("#type")}
        baselines{ $('#projectBaseline')}
        protocol{$('#protocol')}
        measurementTypes {$("#measurementTypes")}
        methods {$("#methods")}
        methodDescription  {$("#methodDescription")}
        collectionApp {$("#collectionApp")}
        location {$('#location')}
        startDate {$("#startDate")}
        endDate {$("#endDate")}
        addition {$("#addition")}
        threatenedSpeciesIndex{$('#threatenedSpeciesIndex')}
        threatenedSpeciesDateOfUpload {$('#threatenedSpeciesIndexUploadDate')}

        publicationUrl {$("#publicationUrl")}
        format {$("#format")}
        dataSetSize {$('#sizeinkb')}
        sensitivities {$("#sensitivities")}
        dataCollectionOngoing{$("#dataCollectionOngoing").module(Checkbox)}

        markCompleted(required: false) {$('[data-bind*="checked:markedAsFinished"]')}

        createButton{$("#save")}

        titleText(required: false) {$('#titleText')}
        programOutcomeText(required: false) {$('#programOutcomeText')}

    }

}
