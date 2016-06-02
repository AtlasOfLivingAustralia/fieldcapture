
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Performance Report | MERIT</title>
    <script type="text/javascript">
        fcConfig = {
            saveReportUrl:'${g.createLink(controller:'report', action:'update', id:report.reportId)}'
        };
    </script>
    <r:require modules="knockout, activity, jqueryValidationEngine, merit_projects"/>
    <style type="text/css">
        .title-row {
            background-color: #f5f5f5;
        }
        .header th {
            white-space: normal;
        }

    td.question {
        width:45%;
    }
    td.meets-expectations {
        width:5%;
    }
    td.evidence {
        width:45%;
    }
    td textarea {
        width:100%;
        box-sizing: border-box;
        height: 5em;
    }


    </style>
</head>

<body>
<div class="${containerType} validationEngineContainer">
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><a class="clickable" href="${g.createLink(controller:'organisation', action:'index', id:report.organisationId)}">Organisation</a> <span class="divider">/</span></li>
        <li class="active">
            ${report.name}
        </li>
    </ul>
    <g:render template="/shared/flashScopeMessage" plugin="fieldcapture-plugin"/>

    <h2>Performance expectations framework</h2>
    <h3>Self assessment worksheet</h3>

    <table class="row-fluid header" data-bind="with:data">
        <thead>
            <tr>
                <th rowspan="2" colspan="2">Performance expectation framework</th>
                <th>Meet expection?</th>
                <th>Evidence</th>
            </tr>
            <tr>
                <th>Yes, No</th>
                <th>Cite evidence</th>
            </tr>
        </thead>



        <g:each in="${themes}" var="theme">
            <tr>
                <th colspan="4">${theme}</th>
            </tr>
            <g:each in="${sectionsByTheme[theme]}" var="section">
                <g:render template="performanceSelfAssessmentSection" model="${section}"></g:render>
            </g:each>
        </g:each>
    </table>

    <div class="form-actions">

        <button type="button" id="save" data-bind="click:save" class="btn btn-primary" title="Save edits and return to the previous page">Save</button>
        <buttom type="button" id="cancel" data-bind="click:cancel" class="btn btn" title="Cancel edits and return to previous page">Cancel</buttom>

    </div>
</div>

<r:script>

    var ViewModel = function(config) {
        var self = this;

        var url = config.saveReportUrl+'/';
        autoSaveModel(self, url);

        self.reportId = '${report.reportId}';
        self.data = {};
        <g:each in="${themes}" var="theme">
        <g:each in="${sectionsByTheme[theme]}" var="section">
        <g:each in="${section.questions}" var="question">
        self.data.meetsExpectation${question.name} = ko.observable();
        self.data.evidenceFor${question.name} = ko.observable();
        </g:each>
        self.data.meetsExpectation${section.additionalPracticeQuestion.name} = ko.observable();
        self.data.evidenceFor${section.additionalPracticeQuestion.name} = ko.observable();

        </g:each>
        </g:each>

        self.save = function() {
           if ($('.validationEngineContainer').validationEngine('validate')) {
                self.saveWithErrorDetection();
           };
        };

        self.load = function(data) {
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
        };


    };
    var report = <fc:modelAsJavascript model="${report}"/>;
    var viewModel = new ViewModel(fcConfig);
    viewModel.load(report.data || {});
    ko.applyBindings(viewModel);
    $('.validationEngineContainer').validationEngine();

</r:script>

</body>
</html>