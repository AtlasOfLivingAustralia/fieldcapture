<html>
<head>
    <meta name="layout" content="${hubConfig.skin}_assets"/>
    <title>Edit | Announcements | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
    var fcConfig = {
        organisationViewUrl: "${createLink(controller:'organisation', action:'index', id:organisation.organisationId)}",
        saveAnnouncementsUrl: "${createLink(controller:'organisation', action:'saveAnnouncements', id:organisation.organisationId, params:[format:'json'])}",
        bulkUploadAnnouncementsUrl: "${createLink(controller: 'organisation', action:'bulkUploadAnnouncements', params:[format:'json'])}",
        returnTo: "${params.returnTo}"
        },
        here = document.location.href;
    </script>

    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="editAnnouncements.css"/>

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

    <g:render template="/shared/timeoutMessage" model="${[newWindow:true]}"/>

<asset:script>
    $(function() {

        function controlsFormatter() {
            return "<button class='btn btn-container add-row' title='Adds a new announcement for this project in the row below this'><i class='icon-plus add-row'></i></button> <button class='btn btn-container remove-row' title='Deletes this announcement'><i class='icon-remove remove-row'></i></button>";
        }

        var events = <fc:modelAsJavascript model="${events}"></fc:modelAsJavascript>;
        var organisationId = '${organisation.organisationId}';
        var projectList = <fc:modelAsJavascript model="${projectList}"/>
        var columns =  [
            {id:'grantID', name:'Grant ID', width:80, field:'grantId', sortable:true},
            {id:'projectName', name:'Project Name '+helpHover('Please select the project your announcement is for from the list'), width:200, field:'name', options:projectList, optionLabel:'name', optionValue:'name', editor: ComboBoxEditor, validationRules:'validate[required]', sortable:true},
            {id:'type', name:'${g.message(code:'announcements.type')} '+helpHover('${g.message(code:'announcements.type.help')}'), width:90, field:'eventType', formatter:optionsFormatter, editor: SelectEditor, options:[{label:'', value:''},{label:'1: funding announcements', value:'1: funding announcements'}, {label:'2: non-funding opportunities', value:'2: non-funding opportunities'}], validationRules:'validate[required]', sortable:true},
            {id:'event', name:'${g.message(code:'announcements.name')} '+helpHover('${g.message(code:'announcements.name.help')}'), width:200, field:'eventName', editor: Slick.Editors.Text, sortable:true},
            {id:'grantOpeningDate', name:'${g.message(code:'announcements.scheduledDate')} '+helpHover('${g.message(code:'announcements.scheduledDate.help')}'), width:80, field:'eventDate', formatter:dateFormatter, editor: DateEditor2, sortable:true},
            {id:'date', name:'${g.message(code:'announcements.when')} '+helpHover('${g.message(code:'announcements.when.help')}'), width:80, field:'grantAnnouncementDate', editor: Slick.Editors.Text, sortable:true},
            {id:'value', name:'${g.message(code:'announcements.funding')} '+helpHover('${g.message(code:'announcements.funding.help')}'), width:100, editor:CurrencyEditor, field:'funding', validationRules:'validate[custom[number]]', sortable:true},
            {id:'eventDescription', name:'${g.message(code:'announcements.description')} '+helpHover('${g.message(code:'announcements.description.help')}'), width:200, field:'eventDescription', maxlength:1000, editor: Slick.Editors.LongText, sortable:true},
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
            editFocusRight:true,
            multiColumnSort: true
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
</asset:script>
</div>

<asset:javascript src="common.js"/>
<asset:javascript src="editAnnouncements.js"/>
<asset:deferredScripts/>

</body>
</html>