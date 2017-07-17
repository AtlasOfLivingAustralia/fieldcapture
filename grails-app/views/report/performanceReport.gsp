
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Performance Report | MERIT</title>
    <script type="text/javascript">
        fcConfig = {
            saveReportUrl:'${g.createLink(controller:'report', action:'update', id:report.reportId)}',
            returnToUrl:'${params.returnTo ?: g.createLink(controller:'organisation', action:'index', id:report.organisationId)}'
        };
    </script>
    <asset:stylesheet src="common.css"/>
</head>

<body>
<div class="${containerType} validationEngineContainer performance-report">
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><a class="clickable" href="${g.createLink(controller:'organisation', action:'index', id:report.organisationId)}">Organisation</a> <span class="divider">/</span></li>
        <li class="active">
            ${report.name}
        </li>
    </ul>
    <g:render template="/shared/flashScopeMessage"/>

    <h3>${report.name}</h3>
    <h4>${organisation.name}</h4>

    <br/>
    <div class="row-fluid">
        <div class="form-inline span12">
            <label for="whoCompletedForm" class="control-label">Who is the authorised person completing this self assessment?</label>
            &nbsp;
            <input id="whoCompletedForm" type="text" class="input-xlarge" data-bind="textInput:data.whoCompletedForm" data-validation-engine="validate[required]">

        </div>
    </div>
    <br/>

    <table class="row-fluid header" data-bind="with:data">
        <thead>
            <tr>
                <th rowspan="2" colspan="2">Performance expectation framework</th>
                <th>Meet expectation?</th>
                <th>Evidence</th>
            </tr>
            <tr>
                <th>Yes, No, N/A</th>
                <th>Cite evidence</th>
            </tr>
        </thead>



        <g:each in="${themes}" var="theme">
            <tr>
                <th colspan="4">${theme}</th>
            </tr>
            <g:each in="${sectionsByTheme[theme]}" var="section">

                <g:render template="/report/performanceSelfAssessmentSection" model="${[section:section, version:version]}"></g:render>

            </g:each>
        </g:each>
    </table>

    <br/>

    <div class="row-fluid">
        <div class="span7">
            <label for="peerAssistanceRequired">Are there any areas of the performance expectations your region would like peer assistance in meeting?</label>
        </div>
        <div class="span5">
            <textarea id="peerAssistanceRequired" type="text" data-bind="textInput:data.peerAssistanceRequired"></textarea>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span7">
            <label for="peerAssistanceOffered">Are there any areas of the performance expectations your region would be able to provide peer assistance on?</label>
        </div>
        <div class="span5">
            <textarea id="peerAssistanceOffered" type="text" data-bind="textInput:data.peerAssistanceOffered"></textarea>
        </div>
    </div>

    <div class="form-actions">

        <button type="button" id="save" data-bind="click:save" class="btn btn-primary" title="Save edits and return to the previous page">Save</button>
        <buttom type="button" id="cancel" data-bind="click:cancel" class="btn btn" title="Cancel edits and return to previous page">Cancel</buttom>

    </div>

    <div id="floating-save" style="display:none;">
        <div class="transparent-background"></div>
        <div><button class="right btn btn-info" data-bind="click: save">Save changes</button></div>
    </div>

</div>


<asset:script>

    var ViewModel = function(config) {
        var self = this;

        var url = config.saveReportUrl+'/';

        self.reportId = '${report.reportId}';
        self.progress = 'started'; // If the report can be validated and saved it is complete.
        self.data = {};
        self.data.state = '${state?:''}'; // For ease of reporting.
        self.data.whoCompletedForm = ko.observable();
        self.data.peerAssistanceRequired = ko.observable();
        self.data.peerAssistanceOffered = ko.observable();
        self.dirtyFlag = ko.dirtyFlag(self, false);

        <g:each in="${themes}" var="theme">
        <g:each in="${sectionsByTheme[theme]}" var="section">
        <g:each in="${section.questions}" var="question">
        self.data.meetsExpectation${question.name} = ko.observable();
        self.data.evidenceFor${question.name} = ko.observable();
        </g:each>
        self.data.meetsExpectation${section.additionalPracticeQuestion.name} = ko.observable();
        self.data.evidenceFor${section.additionalPracticeQuestion.name} = ko.observable();

        self.data.${section.name}OverallRating = ko.computed(function() {
            <g:each in="${section.questions}" var="question">
            if (self.data.meetsExpectation${question.name}() == 'No') {
                return 0;;
            }
            </g:each>
            return (self.data.meetsExpectation${section.additionalPracticeQuestion.name}() == 'No') ? 1 : 2;
        });

        </g:each>
        </g:each>



        self.save = function() {
            var valid = $('.validationEngineContainer').validationEngine('validate');
            if (valid) {
                self.progress = 'finished';
            }
            else {
                self.progress = 'started';
            }
            self.saveWithErrorDetection(function() {
                if (valid) {
                    window.location = config.returnToUrl;
                }
                else {
                    $.unblockUI();
                }
            });

        };

        self.cancel = function() {
            window.location = config.returnToUrl;
        }

        self.load = function(data) {
           self.data.whoCompletedForm(data.whoCompletedForm || '');
           self.data.peerAssistanceRequired(data.peerAssistanceRequired || '');
           self.data.peerAssistanceOffered(data.peerAssistanceOffered || '');
    <g:each in="${themes}" var="theme">
        <g:each in="${sectionsByTheme[theme]}" var="section">
            <g:each in="${section.questions}" var="question">
                self.data.meetsExpectation${question.name}(data.meetsExpectation${question.name});
                self.data.evidenceFor${question.name}(data.evidenceFor${question.name});
            </g:each>

            self.data.meetsExpectation${section.additionalPracticeQuestion.name}(data.meetsExpectation${section.additionalPracticeQuestion.name});
            self.data.evidenceFor${section.additionalPracticeQuestion.name}(data.evidenceFor${section.additionalPracticeQuestion.name});
        </g:each>
    </g:each>

            self.dirtyFlag.reset();
        };

         autoSaveModel(self, url, {blockUIOnSave:true, preventNavigationIfDirty:true});

    };
    var report = <fc:modelAsJavascript model="${report}"/>;
    var viewModel = new ViewModel(fcConfig);
    ko.applyBindings(viewModel);
    viewModel.load(report.data || {});

    $('.validationEngineContainer').validationEngine();

    $('#save').appear().on('appear', function() {
        $('#floating-save').slideUp(400);
    }).on('disappear', function() {
        if (viewModel.dirtyFlag.isDirty()) {
            $('#floating-save').slideDown(400);
        }
        else {
            $('#floating-save').slideUp(400);
        }
    });
    viewModel.dirtyFlag.isDirty.subscribe(function(dirty) {
        if (dirty && !$('#floating-save').is(':appeared')) {
           $('#floating-save').slideDown(400);
        }
        else {
            $('#floating-save').slideUp(400);
        }
    });

</asset:script>
<asset:javascript src="common.js"/>
<asset:javascript src="jquery.appear/jquery.appear.js"/>
<asset:deferredScripts/>

</body>
</html>