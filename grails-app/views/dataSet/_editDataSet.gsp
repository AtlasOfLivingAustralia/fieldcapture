
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
        <label for="projectId" class="col-sm-5 col-form-label">2. Project ID</label>
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
            <g:select multiple="multiple" from="${priorities}" name="investmentPriority" class="form-control" id="investmentPriority" data-validation-engine="validate[required]" data-bind="selectedOptions:investmentPriority"/>
            <div style="margin-top: 10px">
            <textarea type="text" class="form-control" placeholder="Note: This Other Priorities box only enable if other is selected" data-bind="enable: investmentOtherSelected(), value: otherInvestmentPriorities"></textarea>
            </div>
        </div>

    </div>
    <div class="form-group row">
        <label for="type" class="col-sm-5 col-form-label required">7. Is this (a) a baseline dataset associated with a project outcome i.e. against which, change will be measured, (b) a project progress dataset that is tracking change against an established project baseline dataset or (c) a standalone, foundational dataset to inform future management interventions?</label>
        <div class="col-sm-7">
            <select class="form-control" id="type" data-validation-engine="validate[required]" data-bind="value:type">
                <option></option>
                <option>Baseline dataset associated with a project outcome</option>
                <option>Project progress dataset that is tracking change against an established project baseline dataset</option>
                <option>Standalone, foundational dataset to inform future management interventions</option>
                <option>Other</option>
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label for="" class="col-sm-5 col-form-label required">8. What types of measurements or observations does the dataset include? <br/>To select more than one answer, hold down the ‘CTRL’ button whilst selecting an option from the drop-down list</label>
        <div class="col-sm-7">
            <select multiple="multiple" type="text" class="form-control" id="measurementTypes" data-validation-engine="validate[required]" data-bind="selectedOptions:measurementTypes">
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
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            Dataset collection
        </div>
    </div>
    <div class="form-group row">
        <label for="methods" class="col-sm-5 col-form-label required">9. Identify the method(s) used to collect the data. <br/>To select more than one answer, hold down the ‘CTRL’ button whilst selecting an option from the drop-down list</label>
        <div class="col-sm-7">
            <select class="form-control" multiple="multiple" id="methods" data-validation-engine="validate[required]" data-bind="selectedOptions:methods">
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
        <label for="methodDescription" class="col-sm-5 col-form-label required">10. Describe the method used to collect the data in detail.</label>
        <div class="col-sm-7">
            <textarea rows="4"  class="form-control" id="methodDescription" placeholder="" data-validation-engine="validate[required,maxSize[2000]]" data-bind="value:methodDescription"></textarea>
        </div>
    </div>
    <div class="form-group row">
        <label for="collectionApp" class="col-sm-5 col-form-label">11. Identify any apps used during data collection.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="collectionApp" placeholder="" data-bind="value:collectionApp">
        </div>
    </div>
    <div class="form-group row">
        <label for="location" class="col-sm-5 col-form-label">12. Provide a coordinate centroid for the area surveyed.
        (For biophysical/ecological surveys where an app was not used, and where there are no sensitivities in providing a location).
        </label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="location" placeholder="" data-bind="value:location">
        </div>
    </div>
    <div class="form-group row">
        <label for="startDate" class="col-sm-5 col-form-label">13. First collection date.</label>
        <div class="col-sm-3">
            <fc:datePicker type="text"   bs4="true" class="form-control" id="startDate" name="startDate" placeholder="" targetField="startDate.date"/>
        </div>
    </div>
    <div class="form-group row">
        <label for="endDate" class="col-sm-5 col-form-label">14. Last collection date.</label>
        <div class="col-sm-3">
            <fc:datePicker type="text"  bs4="true" class="form-control" id="endDate" placeholder="" data-validation-engine="validate[future[startDate]" targetField="endDate.date"/>
        </div>
    </div>
    <div class="form-group row">
        <label for="addition" class="col-sm-5 col-form-label required">15. Is this data an addition to existing time-series data collected as part of a previous project, or is being collected as part of a broader/national dataset?</label>
        <div class="col-sm-7">
            <select class="form-control" id="addition" data-validation-engine="validate[required]" data-bind="value:addition">
                <option></option>
                <option>Yes</option>
                <option>No</option>
                <option>Don't know</option>
            </select>
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            Dataset accessibility
        </div>
    </div>
    <div class="form-group row">
        <label for="collectorType" class="col-sm-5 col-form-label required">16. Who developed/collated the dataset?</label>
        <div class="col-sm-7">
            <select type="text"  class="form-control" id="collectorType"  data-validation-engine="validate[required]" data-bind="value:collectorType">
                <option></option>
                <option>University researcher</option>
                <option>Specialist consultant</option>
                <option>Service Provider staff</option>
                <option>State Government agency staff</option>
                <option>Community member/volunteer</option>
                <option>Other</option>
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label for="qa" class="col-sm-5 col-form-label required">17. Has a quality assurance check been undertaken on the data?</label>
        <div class="col-sm-7">
            <select class="form-control" id="qa" data-validation-engine="validate[required]" data-bind="value:qa">
                <option></option>
                <option>Yes</option>
                <option>No</option>
                <option>Don't know</option>
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label for="published" class="col-sm-5 col-form-label required">18. Has the data contributed to a publication?</label>
        <div class="col-sm-7">
            <select class="form-control" id="published" data-validation-engine="validate[required]" data-bind="value:published">
                <option></option>
                <option>Yes</option>
                <option>No</option>
                <option>Don't know</option>
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label for="storageType" class="col-sm-5 col-form-label required">19. Where is the data held?</label>
        <div class="col-sm-7">
            <select class="form-control" id="storageType" data-validation-engine="validate[required]" data-bind="value:storageType">
                <option></option>
                <option>Aurion</option>
                <option>Cloud</option>
                <option>CM9</option>
                <option>External Hard Drive</option>
                <option>Oracle Database</option>
                <option>Other Database</option>
                <option>Protected Enclave</option>
                <option>Shared Drive</option>
                <option>Sharepoint</option>
                <option>SPIRE</option>
                <option>Unknown</option>
                <option>Stored internally</option>
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label for="publicationUrl" class="col-sm-5 col-form-label">20. For all public datasets, please provide the published location. If stored internally by your organisation, write ‘stored internally’.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="publicationUrl" placeholder="" data-bind="value:publicationUrl">
        </div>
    </div>
    <div class="form-group row">
        <label for="format" class="col-sm-5 col-form-label required">21. What format is the dataset?</label>
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
        <label for="sensitivities" class="col-sm-5 col-form-label required">22. Are there any sensitivities in the dataset?</label>
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
        </div>
    </div>

    <div class="form-group row">
        <div class="col-sm-5">
            <label for="owner" class="col-form-label required">23. Primary source of data (organisation or individual that owns or maintains the dataset)</label>
            <p>Please include the contact name, physical address, email address and phone number where possible</p>
        </div>


        <div class="col-sm-7">
            <textarea rows="2" class="form-control" id="owner" placeholder="" data-validation-engine="validate[required,maxSize[200]]" data-bind="value:owner"></textarea>
        </div>
    </div>

    <div class="form-group row">
        <div class="col-sm-5 col-form-label">
            <label for="custodian" class="required">24. Dataset custodian (name of contact to obtain access to dataset)</label>
            <p>Please include the contact name, physical address, email address and phone number where possible</p>
        </div>
        <div class="col-sm-7">
            <textarea rows="2" class="form-control" id="custodian" placeholder="" data-validation-engine="validate[required,maxSize[300]]" data-bind="value:custodian"></textarea>
        </div>
    </div>
</form>


