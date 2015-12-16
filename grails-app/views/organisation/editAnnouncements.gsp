<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Edit | Announcements | Field Capture</title>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:script disposition="head">
    var fcConfig = {
        organisationViewUrl: "${createLink(controller:'organisation', action:'index', id:organisation.organisationId)}",
        saveAnnouncementsUrl: "${createLink(controller:'organisation', action:'saveAnnouncements', id:organisation.organisationId, params:[format:'json'])}",
        bulkUploadAnnouncementsUrl: "${createLink(controller: 'organisation', action:'bulkUploadAnnouncements', params:[format:'json'])}",
        returnTo: "${params.returnTo}"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker,slickgrid,jQueryFileUpload,jQueryFileDownload,amplify,merit_projects"/>
    <style type="text/css">
    input.editor-text {box-sizing:border-box; width: 100%;}
    .slick-column-name { white-space: normal; }
    .slick-header-column.ui-state-default { background: #d9edf7; height: 100%; font-weight: bold;}
    .slick-header { background: #d9edf7; }
    .slick-column-name a { background: 0}

    </style>
</head>

<body>
<div class="${containerType}">
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><a href="${createLink(controller:'organisation', action:'index', id:organisation.organisationId)}" class="clickable">Organisation</a> <span class="divider">/</span></li>
        <li class="active">
            Edit Announcements
        </li>
    </ul>
    <div class="row-fluid">
        <h2>Edit Announcements - ${organisation.name}</h2>
    </div>
    <div class="well">
        <p>Instructions:</p>

        <ul>
            <li>Existing announcements can be edited by selecting a table cell.</li>
            <li>To add a new announcement for a project, use the <i class="icon-plus"></i> control in the last column.</li>
            <li>To delete an existing announcement for a project, use the <i class="icon-remove"></i> control in the last column.</li>
            <li>A blank row has been included for each project that does not currently have any announcements.  This is for editing convenience only, there is no need to delete these rows.
            </li>
        </ul>
        <p>Alternatively, use the "Upload data for this table" button to upload announcements from an Excel spreadsheet</p>
    </div>
    <div id="announcementsTable" class="table table-striped" style="width:100%;">

    </div>

    <div class="row-fluid">

        <div class="form-actions" >
            <span class="span3">
                <button type="button" id ="bulkUploadTrigger" data-bind="click:toggleBulkUploadOptions" class="btn btn-small"><i class="icon-upload"></i> Upload data for this table</button>
            </span>
            <span class="span9"style="text-align:right">
                <button type="button" id="save" data-bind="click:save" class="btn btn-primary" title="Save edits and return to the previous page">Save</button>
                <buttom type="button" id="cancel" data-bind="click:cancel" class="btn btn" title="Cancel edits and return to previous page">Cancel</buttom>
            </span>
        </div>
    </div>
    <div id="bulkUpload" class="row-fluid" data-bind="visible:showBulkUploadOptions" style="display:none;">
        When adding new rows to the Excel template, please be sure that the Grant ID and Project Name columns exactly match an existing project.

        <div class="text-left" style="margin:5px">
            <a target="_blank" id="downloadTemplate" class="btn btn-small">Step 1 - Download template (.xlsx)</a>
        </div>

        <div class="text-left" style="margin:5px">
            <span class="btn btn-small fileinput-button">
                Step 2 - Upload populated template <input id="fileupload" type="file" name="announcementsTemplate">
            </span>
        </div>
    </div>

    <g:render template="/shared/timeoutMessage" plugin="fieldcapture-plugin" model="${[newWindow:true]}"/>

<r:script>
    $(function() {

        function controlsFormatter() {
            return "<button class='btn btn-container add-row' title='Adds a new announcement for this project in the row below this'><i class='icon-plus add-row'></i></button> <button class='btn btn-container remove-row' title='Deletes this announcement'><i class='icon-remove remove-row'></i></button>";
        }

        var events = <fc:modelAsJavascript model="${events}"></fc:modelAsJavascript>;
        var organisationId = '${organisation.organisationId}';
        var projectList = <fc:modelAsJavascript model="${projectList}"/>
        var columns =  [
            {id:'grantID', name:'Grant ID', width:80, field:'grantId'},
            {id:'projectName', name:'Project Name '+helpHover('Please select the project your announcement is for from the list'), width:200, field:'name', options:projectList, optionLabel:'name', optionValue:'name', editor: ComboBoxEditor, validationRules:'validate[required]'},
            {id:'type', name:'Type of event '+helpHover('For category 1, funding announcements -  include all funding announcements including: opening of grant rounds, EOI rounds, tenders, and announcements of successful applicants. For category 2, non-funding opportunities -  include all non-funding opportunities such as: field days, community planting day, workshops and other community engagement activities'), width:90, field:'eventType', formatter:optionsFormatter, editor: SelectEditor, options:[{label:'', value:''},{label:'1: funding announcements', value:'1: funding announcements'}, {label:'2: non-funding opportunities', value:'2: non-funding opportunities'}], validationRules:'validate[required]'},
            {id:'event', name:'Name of funding announcement or non-funding opportunity '+helpHover('Enter the name of your funding announcement or non-funding opportunity, for example ‘The Dandenong Ranges bushfire recovery community grants’ or ‘Improving wetlands and woodlands programme  EOI’ or for a non-funding opportunity– ‘the Namoi community tree planting day’'), width:200, field:'eventName', editor: Slick.Editors.Text},
            {id:'grantOpeningDate', name:'Scheduled date for:<br/>1 - Announcing the opening of the grant round;<br/>2 - Non-funding opportunities '+helpHover('Enter the scheduled date for the funding announcement or other non-funding opportunity. If the date is TBC, please enter an indicative date and provide further explanation in the ‘Information about this funding announcement or non-funding opportunity’ column'), width:80, field:'eventDate', formatter:dateFormatter, editor: DateEditor2},
            {id:'date', name:'When will successful applicants be announced '+helpHover('If this is a funding announcement, please provide a two week window of when you anticipate the announcement of the successful funding recipients will occur, for example “12/07/2015 – 26/07/2015”'), width:80, field:'grantAnnouncementDate', editor: Slick.Editors.Text},
            {id:'value', name:'Total value of funding announcement '+helpHover('Provide a total dollar figure of the specific funding announcement eg $10,000 (GST exclusive).'), width:100, editor:CurrencyEditor, field:'funding', validationRules:'validate[custom[number]]'},
            {id:'eventDescription', name:'Information about this funding announcement or non-funding opportunity '+helpHover('(150 word limit) Provide a description of the funding announcement or the non-funding opportunity, i.e. ‘grants from $x - $y are available under the x local programme to undertake A to achieve B’, or ‘targeted EOIs are being invited under the x local programme to undertake A to achieve B. Please note - Information about the successful applicants will be collected separately. For non-funding opportunities, please provide information that sets the context for the event, ie ‘a work shop will be held at location x to showcase how sustainable agricultural processes can benefit riparian health and improved water quality’ or ‘a field day will be held at x to provide community with access to information on revegetation and soil health’.'), width:200, field:'eventDescription', maxlength:1000, editor: Slick.Editors.LongText},
            {id:'controls', name:helpHover('Use + to add a new announcement for the project.  Use - to remove the announcement.'), width:35, minWidth:35, formatter:controlsFormatter}
            ];

        var options = {
            editable:true,
            enableAddRow: false,
            enableCellNavigation: true,
            forceFitColumns:true,
            autoHeight:true,
            explicitInitialization:true,
            enableColumnReorder:false,
            enableTextSelectionOnCells:true,
            editFocusRight:true
        };


        var grid = new Slick.Grid("#announcementsTable", [], columns, options);

        var editAnnouncementsViewModel = new EditAnnouncementsViewModel(grid, events);
        grid.init();

        var options = {
            storageKey : 'BULK_ANNOUNCEMENTS'+organisationId,
            blockUIOnSave: true,
            blockUISaveMessage: "Saving announcements...",
            preventNavigationIfDirty: true
        };

        autoSaveModel(editAnnouncementsViewModel, fcConfig.saveAnnouncementsUrl, options);

        ko.applyBindings(editAnnouncementsViewModel);



        $('.validationEngineContainer').validationEngine({scroll:false});
        $('.helphover').popover({animation: true, trigger:'hover'});
        // Hacky slickgrid / jqueryValidationEngine integration for some amount of user experience consistency.
        $('.slick-row').addClass('validationEngineContainer').validationEngine({scroll:false});

        // The slick table is actually just divs and the header borders don't work unless we set them full height.
        var parentHeight = $('.slick-header-columns').height();
        $('.slick-header-column').height(parentHeight);

        $('#fileupload').fileupload({
            url: fcConfig.bulkUploadAnnouncementsUrl,
            dataType: 'json',
            done: function (e, data) {
                editAnnouncementsViewModel.updateEvents(data.result);
            },
            fail: function (e, data) {
                var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
                showAlert(message, "alert-error","load-xlsx-result-placeholder");
            }
        });
        $('#downloadTemplate').click(function() {

            var url = "${createLink(action:'downloadAnnouncementsTemplate', id:organisation.organisationId)}";
            $.fileDownload(url);
        });

    });
</r:script>
</div>
</body>
</html>