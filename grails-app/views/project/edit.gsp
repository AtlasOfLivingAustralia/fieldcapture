<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="main"/>
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
            <label class="control-label">Project manager</label>
            <div class="controls">
                <g:textField class="" name="manager" data-bind="value:manager"/>
            </div>
        </div>
        <div class="control-group span4">
            <label class="control-label">External id</label>
            <div class="controls">
                <g:textField class="" name="externalId" data-bind="value:externalId"/>
            </div>
        </div>
        <div class="control-group span4">
            <label class="control-label">Grant id</label>
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

    <div class="form-actions">
        <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>

    <hr />
    <div class="debug">
        <h3 id="debug">Debug</h3>
        <div style="display:none">
            <pre data-bind="text: ko.toJSON($root, null, 2)"></pre>
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