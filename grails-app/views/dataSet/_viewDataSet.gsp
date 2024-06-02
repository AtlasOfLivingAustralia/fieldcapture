
<form id="view-data-set" class="validationEngineContainer">
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">1. Dataset title</label>
        <div class="col-sm-7">
            <span id="titleText" data-bind="text:name"></span>
        </div>
    </div>
    <div class="row form-subheading">
        <div class="col-12">
            <i>Background</i>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">2. ${g.message(code:'label.merit.projectID')}</label>
        <div class="col-sm-7">
            <span>${project.grantId}</span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">3. Project name</label>
        <div class="col-sm-7">
            <span>${project.name}</span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">4. What program does this dataset relate to?</label>
        <div class="col-sm-7">
            <span>${programName}</span>
        </div>
    </div>
    <div class="row form-subheading">
        <div class="col-12">
            <i>Dataset description</i>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">5. What program outcome does this dataset relate to?</label>
        <div class="col-sm-7">
            <span id="programOutcomeText" data-bind="text:programOutcome"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">6. What primary or secondary investment priorities or assets does this dataset relate to?</label>
        <div class="col-sm-7">
            <span data-bind="text:investmentPriorities"></span>
            <div class="otherPriority">
                <span data-bind="text:otherInvestmentPriority"></span>
            </div>
        </div>

    </div>
    %{--    Support for legacy data set summaries --}%
    <!-- ko if:term() -->
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">7. Is this data being collected for reporting against short or medium term outcome statements?</label>
        <div class="col-sm-7">
            <span data-bind="text:term"></span>
        </div>
    </div>
    <!-- /ko -->

    <!-- ko if:!term() -->
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">7. Which project service and outcome/s does this data set support? </label>
        <div class="col-sm-7">
            <span data-bind="text:serviceAndOutcomes"></span>
        </div>
    </div>
    <!-- /ko -->

    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">8a. Is this (a) a baseline dataset associated with a project outcome i.e. against which, change will be measured, (b) a project progress dataset that is tracking change against an established project baseline dataset or (c) a standalone, foundational dataset to inform future management interventions?</label>
        <div class="col-sm-7">
            <span data-bind="text:type"></span> - <span data-bind="text:otherDataSetType"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">8b. Which project baseline does this data set relate to or describe?</label>
        <div class="col-sm-7">
            <span data-bind="text:baselines"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">9a. What EMSA protocol was used when collecting the data?</label>
        <div class="col-sm-7">
            <span data-bind="text:protocol"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">9b. What types of measurements or observations does the dataset include?</label>
        <div class="col-sm-7">
            <span data-bind="text:measurementTypes"></span>
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            <i>Dataset collection</i>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">10. Identify the method(s) used to collect the data.</label>
        <div class="col-sm-7">
            <span data-bind="text:methods"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">11. Describe the method used to collect the data in detail.</label>
        <div class="col-sm-7">
            <span data-bind="text:methodDescription"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">12. Identify any apps used during data collection.</label>
        <div class="col-sm-7">
            <span data-bind="text:collectionApp"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">13. Provide a coordinate centroid for the area surveyed.
        (For biophysical/ecological surveys where an app was not used, and where there are no sensitivities in providing a location).
        </label>
        <div class="col-sm-7">
            <!-- ko if:!siteId() -->
            <span data-bind="text:location"></span>
            <!-- /ko -->
            <!-- ko if:siteId() -->
            <span> <a data-bind="attr:{href:siteUrl}" target="_blank">Spatial data has been supplied for this data set</a></span>
            <!-- /ko -->
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">14. First collection date.</label>
        <div class="col-sm-3">
            <div class="input-group input-append">
                <span data-bind="text:startDate.formattedDate"></span>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">15. Last collection date.</label>
        <div class="col-sm-3">
            <div class="input-group input-append">
                <span data-bind="text:endDate.formattedDate"></span>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">16. Is this data an addition to existing time-series data collected as part of a previous project, or is being collected as part of a broader/national dataset?</label>
        <div class="col-sm-7">
            <span data-bind="text:addition"></span>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-sm-5 col-form-label">16a. Has your data been uploaded to the Threatened Species Index?</label>
        <div class="col-sm-7">
            <span data-bind="text:threatenedSpeciesIndex"></span>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">16b. Date of upload, if you answered 'Yes' to 16a above.</label>
        <div class="col-sm-3">
            <div class="input-group input-append">
                <span data-bind="text:threatenedSpeciesIndexUploadDate.formattedDate"></span>
            </div>
        </div>
    </div>
    <div class="row form-subheading">
        <div class="col-12">
            <i>Dataset accessibility</i>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-sm-5 col-form-label">17. Please provide the location/system of where the dataset is held. If possible, provide a URL of the published location. If stored internally by your organisation, write ‘stored internally’.</label>
        <div class="col-sm-7">
            <span data-bind="text:publicationUrl"></span>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-sm-5 col-form-label">18. What format is the dataset?</label>
        <div class="col-sm-7">
            <span data-bind="text:format"></span>
        </div>
    </div>

    <div class="form-group row">
        <div class="col-sm-5">
            <label class="col-form-label">19. What is the size of the dataset (KB)?</label>
            <p>If you don't know the size, check the 'Unknown' checkbox</p>
        </div>

        <div class="col-sm-3">
            <!-- ko if:!sizeUnknown() -->
            <span data-bind="text:sizeInKB"></span>
            <!-- /ko -->
            <!-- ko if:sizeUnknown() -->
            <span>Unknown</span>
            <!-- /ko -->
        </div>
    </div>

    <div class="form-group row">
        <label class="col-sm-5 col-form-label required">20. Are there any sensitivities in the dataset?</label>
        <div class="col-sm-7">
            <span data-bind="text:sensitivities"></span><span data-bind="text:otherSensitivity"></span>
        </div>
    </div>
</form>


