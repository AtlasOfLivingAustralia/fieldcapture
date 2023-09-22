
<form id="edit-data-set" class="validationEngineContainer">
    <div class="form-group row">
        <label for="title" class="col-sm-5 col-form-label required">1. Dataset title</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="title" placeholder="" data-validation-engine="validate[required,maxSize[150]]" data-bind="value:name">
        </div>
    </div>
    <div class="row form-subheading">
        <div class="col-12">
            Background
        </div>
    </div>
    <div class="form-group row">
        <label for="projectId" class="col-sm-5 col-form-label">2. ${g.message(code:'label.merit.projectID')}</label>
        <div class="col-sm-7">
            <input type="text" readonly="readonly" class="form-control" id="projectId" placeholder="" value="${project.grantId}">
        </div>
    </div>
    <div class="form-group row">
        <label for="projectName" class="col-sm-5 col-form-label">3. Project name</label>
        <div class="col-sm-7">
            <input type="text" readonly="readonly" class="form-control" id="projectName" placeholder="" value="${project.name}">
        </div>
    </div>
    <div class="form-group row">
        <label for="programName" class="col-sm-5 col-form-label">4. What program does this dataset relate to?</label>
        <div class="col-sm-7">
            <input type="text" readonly="readonly" class="form-control" id="programName" placeholder="" value="${programName}">
        </div>
    </div>
    <div class="row form-subheading">
        <div class="col-12">
            Dataset description
        </div>
    </div>

    <div class="form-group row">
        <label for="programOutcome" class="col-sm-5 col-form-label required">5. What program outcome does this dataset relate to?</label>
        <div class="col-sm-7">
            <g:select from="${outcomes}" noSelection="['':'Please select...']" class="form-control" id="programOutcome" name="programOutcome" data-validation-engine="validate[required]" data-bind="value:programOutcome"/>
        </div>
    </div>
    <div class="form-group row">
        <label for="investmentPriority" class="col-sm-5 col-form-label required">6. What primary or secondary investment priorities or assets does this dataset relate to?</label>
        <div class="col-sm-7">
            <g:select multiple="multiple" from="${priorities}" name="investmentPriority" class="form-control" id="investmentPriority" data-validation-engine="validate[required]" data-bind="multiSelect2:{value:investmentPriorities}"/>
        </div>

    </div>
%{--    Support for legacy data set summaries --}%
    <!-- ko if:term() -->
    <div class="form-group row">
        <label for="term" class="col-sm-5 col-form-label">7. Is this data being collected for reporting against short or medium term outcome statements?</label>
        <div class="col-sm-7">
            <select class="form-control" id="term" data-bind="value:term">
                <option></option>
                <option>Short-term outcome statement</option>
                <option>Medium-term outcome statement</option>
                <option>Both</option>
            </select>
        </div>
    </div>
    <!-- /ko -->

    <!-- ko if:!term() -->
    <div class="form-group row">
        <label for="projectOutcomes" class="col-sm-5 col-form-label">7. Which project service and outcome/s does this data set support? </label>
        <div class="col-sm-7">
            <select id="projectOutcomes" class="form-control" data-bind="options:projectOutcomeList, optionsText:'label', optionsCaption:'Please select...', value:serviceAndOutcomes"></select>

        </div>
    </div>
    <!-- /ko -->

    <div class="form-group row">
        <label for="type" class="col-sm-5 col-form-label required">8a. Is this (a) a baseline dataset associated with a project outcome i.e. against which, change will be measured, (b) a project progress dataset that is tracking change against an established project baseline dataset or (c) a standalone, foundational dataset to inform future management interventions?</label>
        <div class="col-sm-7">
            <select class="form-control" id="type" data-validation-engine="validate[required]" data-bind="value:type">
                <option></option>
                <option>Baseline dataset associated with a project outcome</option>
                <option>Project progress dataset that is tracking change against an established project baseline dataset</option>
                <option>Standalone, foundational dataset to inform future management interventions</option>
                <option>Other</option>
            </select>
            <div class="otherDataSetType other">
                <textarea type="text" class="form-control otherPriorityTextArea" placeholder="Note: This field will only enable if Other is selected" data-bind="enable: type() == 'Other', value: otherDataSetType"></textarea>
            </div>

        </div>
    </div>

    <div class="form-group row">
        <label for="projectBaseline" class="col-sm-5 col-form-label required">8b. Which project baseline does this data set relate to or describe?</label>
        <div class="col-sm-7">
            <select class="form-control" id="projectBaseline" data-validation-engine="validate[required]" data-bind="options:projectBaselines, optionsText:'label', optionsValue:'value', optionsCaption:'Please select...', value:projectBaseline"></select>
        </div>
    </div>

    <div class="form-group row">
        <label for="protocol" class="col-sm-5 col-form-label required">9a. What EMSA protocol was used when collecting the data?</label>
        <div class="col-sm-7">
            <select class="form-control" id="protocol" data-validation-engine="validate[required]" data-bind="options:projectProtocols, optionsText:'label', optionsValue:'value', optionsCaption:'Please select...', value:protocol">
            </select>
        </div>
    </div>

    <div class="form-group row">
        <label for="measurementTypes" class="col-sm-5 col-form-label required">9b. What types of measurements or observations does the dataset include? <br/>To select more than one answer, hold down the ‘CTRL’ button whilst selecting an option from the drop-down list</label>
        <div class="col-sm-7">
            <select multiple="multiple" type="text" class="form-control" id="measurementTypes" data-validation-engine="validate[required]" data-bind="disable: protocol() != 'other', multiSelect2:{value:measurementTypes}">
                <option>Abundance</option>
                <option>Adoption - climate and market demands</option>
                <option>Adoption - land resource management practices</option>
                <option>Awareness, knowledge, skills, confidence</option>
                <option>Basal area</option>
                <option>Coarse woody debris</option>
                <option>Condition</option>
                <option>Fauna - invertebrate</option>
                <option>Fauna - vertebrate</option>
                <option>Fire</option>
                <option>Flora</option>
                <option>Genetic diversity</option>
                <option>Groundcover</option>
                <option>Habitat condition</option>
                <option>Interventions</option>
                <option>Opportune records</option>
                <option>Other</option>
                <option>Participation</option>
                <option>Publication of materials</option>
                <option>Recruitment - Fauna, flora</option>
                <option>Site description</option>
                <option>Soil composition</option>
                <option>Soil erosion</option>
                <option>Targeted - feral animals</option>
                <option>Targeted - threatened species</option>
                <option>Targeted - weeds</option>
                <option>Water quality
            </select>
            <div class="otherMeasurementType other">
                <textarea type="text" class="form-control otherPriorityTextArea" placeholder="Note: This field will only enable if Other is selected" data-bind="enable: measurementTypes() && measurementTypes().indexOf('Other') >= 0, value: otherMeasurementType"></textarea>
            </div>
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            Dataset collection
        </div>
    </div>
    <div class="form-group row">
        <label for="methods" class="col-sm-5 col-form-label required">10. Identify the method(s) used to collect the data. <br/>To select more than one answer, hold down the ‘CTRL’ button whilst selecting an option from the drop-down list</label>
        <div class="col-sm-7">
            <select class="form-control" multiple="multiple" id="methods" data-validation-engine="validate[required]" data-bind="disable: protocol() != 'other', multiSelect2:{value:methods}">
                <option>Genetic sampling</option>
                <option>Hair, track, dung sampling</option>
                <option>Area sampling</option>
                <option>Water quality sampling</option>
                <option>Active searching</option>
                <option>Aerial photography</option>
                <option>Call playback</option>
                <option>Camera trapping</option>
                <option>Data extraction</option>
                <option>Distance sampling</option>
                <option>Grab sampling</option>
                <option>Habitat condition assessment</option>
                <option>Mark-recapture</option>
                <option>Meta-analysis</option>
                <option>Other</option>
                <option>Photopoints</option>
                <option>Plotless sampling</option>
                <option>Quadrat sampling</option>
                <option>Participant surveys</option>
                <option>Soil sampling and analysis</option>
                <option>Surber sampling</option>
                <option>Surveying - Fauna, Flora</option>
                <option>Transect sampling</option>
                <option>Trapping</option>
                <option>Vegetation mapping</option>
                <option>Ground cover monitoring
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label for="methodDescription" class="col-sm-5 col-form-label required">11. Describe the method used to collect the data in detail.</label>
        <div class="col-sm-7">
            <textarea rows="4"  class="form-control" id="methodDescription" placeholder="" data-validation-engine="validate[required,maxSize[2000]]" data-bind="disable: protocol() != 'other', value:methodDescription"></textarea>
        </div>
    </div>
    <div class="form-group row">
        <label for="collectionApp" class="col-sm-5 col-form-label">12. Identify any apps used during data collection. <p>Where the 'Monitor' app has not been used, please provide details</p></label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="collectionApp" placeholder="" data-bind="value:collectionApp">
        </div>
    </div>
    <div class="form-group row">
        <label for="location" class="col-sm-5 col-form-label">13. Provide a coordinate centroid for the area surveyed.
        (For biophysical/ecological surveys where an app was not used, and where there are no sensitivities in providing a location). <p>For biophysical/ecological surveys where an app was not used, and where there are no sensitivities in providing a location</p>
        </label>
        <div class="col-sm-7">
            <!-- ko if:!siteId() -->
            <input type="text" class="form-control" id="location" placeholder="" data-bind="value:location">
            <!-- /ko -->
            <!-- ko if:siteId() -->
            <span class="form-control"> <a data-bind="attr:{href:siteUrl}" target="_blank">Spatial data has been supplied for this data set</a></span>
            <!-- /ko -->
        </div>
    </div>
    <div class="form-group row">
        <label for="startDate" class="col-sm-5 col-form-label">14. First collection date.</label>
        <div class="col-sm-3">
            <div class="input-group input-append">
                <fc:datePicker type="text"   bs4="true" class="form-control" id="startDate" name="startDate" placeholder="" targetField="startDate.date"/>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <label for="endDate" class="col-sm-5 col-form-label">15. Last collection date.</label>
        <div class="col-sm-3">
            <div class="input-group input-append">
                <fc:datePicker type="text"  bs4="true" class="form-control" id="endDate" placeholder="" data-validation-engine="validate[future[startDate]]" targetField="endDate.date"/>

            </div>
        </div>
        <div class="col-sm-3" id="dataCollectionOngoingDiv">
            <label class="checkbox">
                <input type="checkbox" id="dataCollectionOngoing" data-bind="checked:dataCollectionOngoing">
                Data collection is ongoing
            </label>
        </div>
    </div>
    <div class="form-group row">
        <label for="addition" class="col-sm-5 col-form-label required">16. Is this data an addition to existing time-series data collected as part of a previous project, or is being collected as part of a broader/national dataset?</label>
        <div class="col-sm-7">
            <select class="form-control" id="addition" data-validation-engine="validate[required]" data-bind="value:addition">
                <option></option>
                <option>Yes</option>
                <option>No</option>
                <option>Don't know</option>
            </select>
        </div>
    </div>

    <div class="form-group row">
        <label for="threatenedSpeciesIndex" class="col-sm-5 col-form-label">16a. Has your data been uploaded to the Threatened Species Index?</label>
        <div class="col-sm-7">
            <select class="form-control" id="threatenedSpeciesIndex" data-bind="value:threatenedSpeciesIndex">
                <option></option>
                <option>Yes</option>
                <option>No</option>
                <option>Unsure</option>
            </select>
        </div>
    </div>

    <div class="form-group row">
        <label for="threatenedSpeciesIndex" class="col-sm-5 col-form-label required">16b. Date of upload, if you answered 'Yes' to 16a above.</label>
        <div class="col-sm-3">
            <div class="input-group input-append">
                <fc:datePicker type="text" bs4="true" class="form-control" id="threatenedSpeciesIndexUploadDate" placeholder="" data-validation-engine="validate[required]" data-bind="datepicker:threatenedSpeciesIndexUploadDate.date, enable: threatenedSpeciesIndex() == 'Yes'" targetField="" required="true"/>
            </div>
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            Dataset accessibility
        </div>
    </div>
    <div class="form-group row">
        <label for="publicationUrl" class="col-sm-5 col-form-label">17. Please provide the location/system of where the dataset is held. If possible, provide a URL of the published location. If stored internally by your organisation, write ‘stored internally’.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="publicationUrl" placeholder="" data-bind="value:publicationUrl">
        </div>
    </div>
    <div class="form-group row">
        <label for="format" class="col-sm-5 col-form-label required">18. What format is the dataset?</label>
        <div class="col-sm-7">
            <select class="form-control" id="format" data-validation-engine="validate[required]" data-bind="value:format">
                <option></option>
                <option>CSV</option>
                <option>XML</option>
                <option>JSON</option>
                <option>Text</option>
                <option>Excel</option>
                <option>Database Table</option>
                <option>Database View</option>
                <option>Shape File</option>
                <option>ESRI REST</option>
                <option>Other</option>
            </select>
        </div>
    </div>


    <div class="form-group row">
        <div class="col-sm-5">
            <label for="sizeinkb" class="col-form-label required">19. What is the size of the dataset (KB)?</label>
            <p>If you don't know the size, check the 'Unknown' checkbox</p>
        </div>

        <div class="col-sm-3">
            <input type="number" class="form-control" id="sizeinkb" placeholder="" data-validation-engine="validate[required]" data-bind="enable:!sizeUnknown(), value:sizeInKB">

        </div>
        <div class="col-sm-4">
            <div class="form-check">
                <input id="sizeUnknown" type="checkbox" class="form-check-input" data-bind="checked:sizeUnknown">
                <label for="sizeUnknown" class="form-check-label">Unknown</label>
            </div>
        </div>
    </div>

    <div class="form-group row">
        <label for="sensitivities" class="col-sm-5 col-form-label required">20. Are there any sensitivities in the dataset?</label>
        <div class="col-sm-7">
            <select class="form-control" multiple="multiple" id="sensitivities" data-validation-engine="validate[required]" data-bind="selectedOptions:sensitivities">
                <option>No</option>
                <option>Indigenous/cultural</option>
                <option>Commercially sensitive</option>
                <option>Ecologically sensitive</option>
                <option>Personally identifiable information</option>
                <option>Legally sensitive</option>
                <option>Other</option>
            </select>
            <div class="otherSensitivity other">
                <textarea type="text" class="form-control otherSensitivityTextArea" placeholder="Note: This field will only enable if Other is selected" data-bind="enable: sensitivities() && sensitivities().indexOf('Other') >= 0, value: otherSensitivity"></textarea>
            </div>
        </div>

    </div>

</form>


