<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>${create ? 'New' : ('Edit | ' + project?.name)} | Projects | Field Capture</title>
    <r:require modules="knockout,jqueryValidationEngine,datepicker"/>
</head>
<body>
    <div class="container-fluid validationEngineContainer" id="validation-container">

    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <g:if test="${create}">
            <li class="active">Create new project</li>
        </g:if>
        <g:else>
            <li><g:link controller="project" action="index" id="${project.projectId}">${project.name}</g:link> <span class="divider">/</span></li>
            <li class="active">Edit</li>
        </g:else>
    </ul>
    <div class="row-fluid">
        <div class="page-header">
            <h1 data-bind="text: name"></h1><h1 data-bind="visible: !name()">Creating new project</h1>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <div class="control-group span7">
                <label for="name" class="control-label">Project name</label>
                <div class="controls">
                    <input type="text" class="input-xxlarge" id="name" data-bind="value: name"
                        data-validation-engine="validate[required]"/>
                </div>
            </div>
            <div class="control-group span5">
                <label class="control-label">Organisation</label>
                <select class="input-xlarge"
                    data-bind="options:organisations, optionsText:'name', optionsValue:'uid', value:organisation, optionsCaption: 'Choose...'"></select>
            </div>
        </div>
    </div>
    <div class="row-fluid">
        <div class="control-group">
            <label for="description" class="control-label">Project description</label>
            <div class="controls">
                <textarea data-bind="value:description" class="input-xxlarge" id="description" rows="3" cols="50"></textarea>
            </div>
        </div>
    </div>
    <div class="row-fluid">
        <div class="control-group span4">
            <label class="control-label" for="manager">Project manager</label>
            <div class="controls">
                <g:textField class="" name="manager" data-bind="value:manager"/>
            </div>
        </div>
        <div class="control-group span4">
            <label class="control-label" for="externalId">External id</label>
            <div class="controls">
                <g:textField class="" name="externalId" data-bind="value:externalId"/>
            </div>
        </div>
        <div class="control-group span4">
            <label class="control-label" for="grantId">Grant id</label>
            <div class="controls">
                <g:textField class="" name="grantId" data-bind="value:grantId"/>
            </div>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span4 control-group">
            <label for="startDate">Start date
            <fc:iconHelp title="Start date">Date the activity was started.</fc:iconHelp>
            </label>
            <div class="input-append">
                <input data-bind="datepicker:plannedStartDate.date" id="startDate" type="text" size="16"
                       data-validation-engine="validate[required]"/>
                <span class="add-on open-datepicker"><i class="icon-th"></i></span>
            </div>
        </div>
        <div class="span4">
            <label for="endDate">End date
            <fc:iconHelp title="End date">Date the activity finished.</fc:iconHelp>
            </label>
            <div class="input-append">
                <input data-bind="datepicker:plannedEndDate.date" id="endDate" type="text" size="16"
                       data-validation-engine="validate[required]"/>
                <span class="add-on open-datepicker"><i class="icon-th"></i></span>
            </div>
        </div>
    </div>

    <!-- ko stopBinding: true -->
    <div class="well" id="projectImageContainer">
        <label>Project Image</label>
        <div class="row-fluid">
            <div class="control-group span4">
                <label for="imageFilename">File name</label>
                <input type="text" data-bind="value:filename" id="imageFilename"/>
            </div>
            <div class="control-group span4">
                <label for="imageCaption">Caption</label>
                <input type="text" data-bind="value:name" id="imageCaption"/>
            </div>
            <div class="control-group span4">
                <label for="imageAttribution">Attribution</label>
                <input type="text" data-bind="value:attribution" id="imageAttribution"/>
            </div>
        </div>
        <div class="expandable-debug">
            <h3>Debug</h3>
            <div>
                <h4>project image model</h4>
                <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
            </div>
        </div>
    </div>
    <!-- /ko -->

    <div class="form-actions">
        <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>

    <hr />
    <div class="expandable-debug">
        <h3>Debug</h3>
        <div>
            <h4>KO model</h4>
            <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
            <h4>Project</h4>
            <pre>${project}</pre>
        </div>
    </div>

</div>
<r:script>

    $(function(){

        //$('.validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = "${create ? createLink(controller: 'home', action: 'index') :
                createLink(action: 'index', id: project?.projectId)}";
        });

        var organisations = ${institutions};

        /* This section is a separate view model to modularise image handling.
         *  The block of view code (html) must be expunged from the main model using the
         *  "stopBinding: true" syntax.
         *  This model must be bound to an element inside that block.
         *  @param image is an object representing an existing image or default values
         *  @param owner is an object with key and values properties - these are used to associate the
         *      image with an entity eg. key='projectId', value=<id>
         */
        function ImageViewModel (img, owner, updateUrl) {
            var self = this;
            this.filename = ko.observable(img ? img.filename : '');
            this.name = ko.observable(img ? img.name : '');
            this.attribution = ko.observable(img ? img.attribution : '');
            this.type = img.type || 'image';
            this.role = img.role;
            this.documentId = img ? img.documentId : '';
            this[owner.key] = owner.value;
            this.save = function () {
                $.ajax({
                    url: updateUrl + self.documentId,
                    type: 'POST',
                    data: ko.toJSON(self),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            alert(data.detail + ' \n' + data.error);
                        }
                    },
                    error: function (data) {
                        var status = data.status;
                        alert('An unhandled error occurred: ' + data.status);
                    }
                });
            }
        }

        // find an image with the right properties in the available 'documents'
        var docs = ${project?.documents ?: []},
            image = {type: 'image', role: 'primary'};
        $.each(docs, function (i, doc) {
            if (doc.type === 'image' && doc.role === 'primary') {
                image = doc;
            }
        });

        // create the model
        var imageViewModel = new ImageViewModel(
            image,
            {key: 'projectid', value: "${project.projectId}"},
            "${createLink(controller: 'proxy', action: 'documentUpdate')}/");

        // bind the model
        ko.applyBindings(imageViewModel, document.getElementById('projectImageContainer'));
        /* END of section to modularise image handling */

        function ViewModel (data) {
            var self = this;
            self.name = ko.observable(data.name);
            self.description = ko.observable(data.description);
            self.externalId = ko.observable(data.externalId);
            self.grantId = ko.observable(data.grantId);
            self.manager = ko.observable(data.manager);
            self.plannedStartDate = ko.observable(data.plannedStartDate).extend({simpleDate: false});
            self.plannedEndDate = ko.observable(data.plannedEndDate).extend({simpleDate: false});
            self.organisation = ko.observable(data.organisation);
            self.organisations = organisations;
            self.removeTransients = function (jsData) {
                delete jsData.organisations;
                return jsData;
            };
            self.save = function () {
                // save any changes to the image metadata
                imageViewModel.save();

                //if ($('.validation-container').validationEngine('validate')) {
                    var jsData = ko.toJS(self);
                    var json = JSON.stringify(self.removeTransients(jsData));
                    var id = "${project?.projectId ? '/' + project.projectId : ''}";
                    $.ajax({
                        url: "${createLink(action: 'ajaxUpdate')}" + id,
                        type: 'POST',
                        data: json,
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.error) {
                                alert(data.detail + ' \n' + data.error);
                            } else {
                                var projectId = "${project?.projectId}" || data.projectId;
                                if (data.message === 'created') {
                                    document.location.href = "${createLink(controller: 'home', action: 'index')}";
                                } else {
                                    document.location.href = "${createLink(action: 'index')}/" + projectId;
                                }
                            }
                        },
                        error: function (data) {
                            var status = data.status;
                            alert('An unhandled error occurred: ' + data.status);
                        }
                    });
                //}
            }
        }

        var viewModel = new ViewModel(${project ?: [:]});
        ko.applyBindings(viewModel);

    });

</r:script>

</body>
</html>