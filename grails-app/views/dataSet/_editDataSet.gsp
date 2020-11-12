
<form id="edit-data-set">
    <div class="form-group row">
        <label for="title" class="col-sm-5 col-form-label">1. Dataset title</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="title" placeholder="" data-bind="value:name">
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
            <input type="text" readonly="readonly" class="form-control" id="projectId" placeholder="" data-bind="value:grantId">
        </div>
    </div>
    <div class="form-group row">
        <label for="projectName" class="col-sm-5 col-form-label">3. Project name</label>
        <div class="col-sm-7">
            <input type="text" readonly="readonly" class="form-control" id="projectName" placeholder="" data-bind="value:projectName">
        </div>
    </div>
    <div class="form-group row">
        <label for="programName" class="col-sm-5 col-form-label">4. What program does this dataset relate to?</label>
        <div class="col-sm-7">
            <input type="text" readonly="readonly" class="form-control" id="programName" placeholder="" data-bind="value:programName">
        </div>
    </div>
    <div class="row form-subheading">
        <div class="col-12">
            Dataset description
        </div>
    </div>
    <div class="form-group row">
        <label for="programOutcome" class="col-sm-5 col-form-label">5. What program outcome does this dataset relate to?</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="collector" placeholder="" data-bind="value:collector">
        </div>
    </div>
    <div class="form-group row">
        <label for="investmentPriority" class="col-sm-5 col-form-label">6. What primary or secondary investment priority does this dataset relate to?</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="investmentPriority" placeholder="" data-bind="value:investmentPriority">
        </div>
    </div>
    <div class="form-group row">
        <label for="type" class="col-sm-5 col-form-label">7. Is this (a) a baseline dataset associated with a project outcome i.e. against which, change will be measured, (b) a project progress dataset that is tracking change against an established project baseline dataset or (c) a standalone, foundational dataset to inform future management interventions?</label>
        <div class="col-sm-7">
            <select class="form-control" id="type" data-bind="value:type, options:types"></select>
        </div>
    </div>
    <div class="form-group row">
        <label for="" class="col-sm-5 col-form-label">8. What types of measurements or observations does the dataset include?</label>
        <div class="col-sm-7">
            <input type="text" class="form-control" id="" placeholder="" data-bind="value:measurementTypes">
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            Dataset collection
        </div>
    </div>
    <div class="form-group row">
        <label for="method" class="col-sm-5 col-form-label">9. Identify the method(s) used to collect the data.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="method" placeholder="" data-bind="value:method">
        </div>
    </div>
    <div class="form-group row">
        <label for="methodDescription" class="col-sm-5 col-form-label">10. Describe the method used to collect the data in detail.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="methodDescription" placeholder="" data-bind="value:methodDescription">
        </div>
    </div>
    <div class="form-group row">
        <label for="collectionApp" class="col-sm-5 col-form-label">11. Identify any apps used during data collection.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="collectionApp" placeholder="" data-bind="value:collectionApp">
        </div>
    </div>
    <div class="form-group row">
        <label for="centroid" class="col-sm-5 col-form-label">12. Provide a coordinate centroid for the area surveyed.
        (For biophysical/ecological surveys where an app was not used, and where there are no sensitivities in providing a location).
        </label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="centroid" placeholder="" data-bind="value:centroid">
        </div>
    </div>
    <div class="form-group row">
        <label for="startDate" class="col-sm-5 col-form-label">13. First collection date.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="startDate" placeholder="" data-bind="value:startDate">
        </div>
    </div>
    <div class="form-group row">
        <label for="endDate" class="col-sm-5 col-form-label">14. Last collection date.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="endDate" placeholder="" data-bind="value:endDate">
        </div>
    </div>
    <div class="form-group row">
        <label for="addition" class="col-sm-5 col-form-label">15. Is this data an addition to existing time-series data collected as part of a previous project, or is being collected as part of a broader/national dataset?</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="addition" placeholder="" data-bind="value:addition">
        </div>
    </div>

    <div class="row form-subheading">
        <div class="col-12">
            Dataset accessibility
        </div>
    </div>
    <div class="form-group row">
        <label for="collector" class="col-sm-5 col-form-label">16. Who developed/collated the dataset?</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="programOutcome" placeholder="" data-bind="value:programOutcome">
        </div>
    </div>
    <div class="form-group row">
        <label for="qa" class="col-sm-5 col-form-label">17. Has a quality assurance check been undertaken on the data?</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="qa" placeholder="" data-bind="value:qa">
        </div>
    </div>
    <div class="form-group row">
        <label for="published" class="col-sm-5 col-form-label">18. Has the data contributed to a publication?</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="published" placeholder="" data-bind="value:published">
        </div>
    </div>
    <div class="form-group row">
        <label for="curator" class="col-sm-5 col-form-label">19. Where is the data held?</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="curator" placeholder="" data-bind="value:curator">
        </div>
    </div>
    <div class="form-group row">
        <label for="publicationUrl" class="col-sm-5 col-form-label">20. For all public datasets, please provide the published location. If stored internally by your organisation, write ‘stored internally’.</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="publicationUrl" placeholder="" data-bind="value:publicationUrl">
        </div>
    </div>
    <div class="form-group row">
        <label for="format" class="col-sm-5 col-form-label">21. What format is the dataset?</label>
        <div class="col-sm-7">
            <input type="text"  class="form-control" id="format" placeholder="" data-bind="value:format">
        </div>
    </div>
</form>

