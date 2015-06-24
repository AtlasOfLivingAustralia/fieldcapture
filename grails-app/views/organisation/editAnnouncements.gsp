<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Edit | Announcements | Field Capture</title>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:script disposition="head">
    var fcConfig = {
        organisationViewUrl: "${createLink(controller:'organisation', action:'index', id:organisation.organisationId)}",
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        saveUrl: "${createLink(controller:'activity', action:'ajaxUpdate')}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
        returnTo: "${params.returnTo}"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker,slickgrid,jQueryFileUpload,jQueryFileDownload,amplify"/>
    <style type="text/css">
    input.editor-text {box-sizing:border-box; width: 100%;}
    .slick-column-name { white-space: normal; }
    .slick-header-column.ui-state-default { background: #DAE0B9; height: 100%; font-weight: bold;}
    .slick-header { background: #DAE0B9; }

    </style>
</head>

<body class="container-fluid">
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><a href="${createLink(controller:'organisation', action:'index', id:organisation.organisationId)}" class="clickable">Organisation</a> <span class="divider">/</span></li>
        <li class="active">
            Edit Announcements
        </li>
    </ul>
    <div class="row-fluid">
        <h2>Edit Announcements</h2>
    </div>

    <div id="announcementsTable" class="table table-striped" style="width:100%;">

    </div>

    <div class="row-fluid">

        <div class="form-actions" >
            <span class="span3">
                <button type="button" id ="bulkUploadTrigger" class="btn btn-small"><i class="icon-upload"></i> Upload data for this table</button>
                <div id="bulkUpload" style="display:none;">
                    <div class="text-left" style="margin:5px">
                        <a target="_blank" id="downloadTemplate" class="btn btn-small">Step 1 - Download template (.xlsx)</a>
                    </div>

                    <div class="text-left" style="margin:5px">
                        <span class="btn btn-small fileinput-button">
                            Step 2 - Upload populated template <input id="fileupload" type="file" name="templateFile">
                        </span>
                    </div>
                </div>
            </span>
            <span class="span9"style="text-align:right">
                <button type="button" id="save" class="btn btn-primary" title="Save edits and return to the previous page">Save</button>
                <buttom type="button" id="cancel" class="btn btn" title="Cancel edits and return to previous page">Cancel</buttom>
            </span>
        </div>
    </div>


<r:script>
    $(function() {

        var events = <fc:modelAsJavascript model="${events}"></fc:modelAsJavascript>;
        var columns =  [
            {id:'grantID', name:'Grant ID', width:10, field:'grantId'},
            {id:'projectName', name:'Project Name', width:25, field:'name', options:['','Greening the west of Melbourne - Point Cook Coastal Park and Port Phillip Bay Western Shoreline Nature Link Enhancement', 'cat', 'mat'], editor: ComboBoxEditor},
            {id:'date', name:'Proposed Date of event/announcement (if known)', width:10, field:'eventDate', editor: Slick.Editors.Date},
            {id:'event', name:'Proposed event/annoucement', field:'eventName', editor: Slick.Editors.Text},
            {id:'eventDescription', name:'Description of the event', field:'eventDescription', editor: Slick.Editors.LongText},
            {id:'media', name:'Will there be, or do you intend there to be, media involvement in this event?', width:10, field:'media'}
            ];

        var options = {
            editable:true,
            enableAddRow: true,
            enableCellNavigation: true,
            forceFitColumns:true,
            autoHeight:true,
            explicitInitialization:true
        };


        var grid = new Slick.Grid("#announcementsTable", events, columns, options);
        grid.onAddNewRow.subscribe(function (e, args) {
            var item = args.item;
            grid.invalidateRow(events.length);
            events.push(item);
            grid.updateRowCount();
            grid.render();
        });
        grid.init();


    });
</r:script>
</body>
</html>