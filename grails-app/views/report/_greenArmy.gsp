
<head>
    <style type="text/css">
        #Docs tr.selected td {
            background-color: #FFFFCC;
        }
    </style>

</head>
<!-- ko stopBinding:true -->
<div id="greenArmyReport">
<h2>Green Army Reporting</h2>

<div class="row-fluid">
    <span class="span1">For financial year</span><span class="span1"><select name="financialYear"><option name="2014">2014/15</option></select></span><span class="span9"></span><span class="span1"><img src="" title="Green Army Logo"></span>
</div>
<g:set var="tabConfig" value="${[[name:'Jul',template:'monthly',title:'July',yearModifier:0], [name:'Aug',template:'monthly', title:'August',yearModifier:0], [name:'Sep',template:'monthly', title:'September',yearModifier:0], [name:'Oct',template:'monthly', title:'October',yearModifier:0], [name:'Nov',template:'monthly',title:'November',yearModifier:0], [name:'Dec',template:'monthly',title:'December',yearModifier:0], [name:'Jan',template:'monthly',title:'January',yearModifier:1], [name:'Feb',template:'monthly', title:'February',yearModifier:1], [name:'Mar',template:'monthly',title:'March',yearModifier:1], [name:'Apr',template:'monthly', title:'April', yearModifier:1], [name:'May',template:'monthly', title:'May',yearModifier:1], [name:'Jun',template:'monthly', title:'June',yearModifier:1], [name:'Q1',template:'quarterly', yearModifier:0], [name:'Q2',template:'quarterly'], [name:'Q3',template:'quarterly'], [name:'Q4',template:'quarterly'], [name:'Docs',template:'docsTemplate']]}"/>
<div class="row-fluid">
    <span class="span12">
        <ul class="nav nav-tabs" data-tabs="tabs">
            <g:each in="${tabConfig}" var="tab" status="i">
                <li class="tab <g:if test='${i == 0}'>active</g:if>"><a id="${tab.name}-tab" data-toggle="tab" href="#${tab.name}">${tab.name}</a></li>
            </g:each>

        </ul>
    </span>
</div>

<div class="tab-content">

<g:each in="${tabConfig}" var="tab">
    <div class="tab-pane" id="${tab.name}" data-bind="template:{name:'${tab.template}', data:${tab.name}ViewModel, afterRender:initialise}"></div>
</g:each>

</div>


<!-- Monthly report -->
<script id="monthly" type="text/html">

    <div class="well">
        <h3>Summary Statistics for <span data-bind="text:title"></span> (all projects)</h3>
        <div class="row-fluid">
            <span class="span6">
                <h4>Projects</h4>
                Total number of projects:
                Number of new projects:
                Number of projects completed in period:
                Number of projects not completed in period:
                Number of projects on track & MERIT updated:
                Number of projects on track & MERIT not updated:

            </span>
            <span class="span6">
                <h4>Participants and Training</h4>
                Number of participants who commenced on projects:
                Number of participants who did not complete projects in period:
                Number of participants who completed projects in period:
                Number of participants who completed
            </span>

        </div>
    </div>

    <div class="well">
        <h3>Project-by-project Monthly Report for ${date}</h3>
        <div class="row-fluid">
            <span class="span12">
                <table class="activityTable">
                    <th>
                        <tr>
                            <th colspan="7">Project Data</th>
                            <th colspan="7">Participant and Training Data</th>
                        </tr>
                        <tr>
                            <th>

                            </th>
                        </tr>
                    </th>
                </table>
            </span>

        </div>

    </div>
</script>

<!-- Quarterly report -->

<script id="quarterly" type="text/html">


    <div class="well">
        <h3>Year-to-date Quarterly Report Summary</h3>
        <div class="row-fluid">
            <span class="span12">
                <table>
                    <thead>
                        <tr>
                            <th colspan="7">Project Data</th>
                            <th colspan="7">Participant and Training Data</th>
                        </tr>
                        <tr>
                            <th>

                            </th>
                        </tr>
                    </thead>

                </table>
            </span>

        </div>

    </div>

    <div class="well">
        <h3>Project-by-project Quarterly Report for July-September 2014</h3>
        <div class="row-fluid">
            <span class="span12">
                <table>
                    <th>
                        <tr>
                            <th colspan="7">Project Data</th>
                            <th colspan="7">Participant and Training Data</th>
                        </tr>
                        <tr>
                            <th>

                            </th>
                        </tr>
                    </th>
                </table>
            </span>

        </div>
    </div>

</script>

<!-- Ad hoc report -->

<script id="docsTemplate" type="text/html">


    <div class="well">
        <h3>Ad-hoc Documents</h3>
        <div class="row-fluid">
            <span class="span5">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Grant ID</th>
                            <!-- ko foreach: categories -->
                            <th><span data-bind="text:$data"></span> </th>
                            <!-- /ko -->
                        </tr>
                    </thead>
                    <tbody data-bind="foreach:projects">
                            <tr data-bind="css:{'selected':$parent.selectedGrantId()==grantId}">
                                <td><input type="radio" name="selectedGrantId" data-bind="value:grantId, checked:$parent.selectedGrantId"></td>
                                <td><span data-bind="text:grantId"></span></td>
                                <!-- ko foreach: counts -->
                                <td><span data-bind="text:$data"></span></td>
                                <!-- /ko -->
                            </tr>

                    </tbody>

                </table>
            </span>
            <span class="span7" data-bind="with:selectedProject">
                <strong>Documents for Project <span data-bind="text:$parent.selectedGrantId"></span></strong>
                <table>
                    <thead>
                        <tr>
                            <th>Date attached</th>
                            <th>Document type</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach:reports">
                        <tr>
                            <td><span data-bind="text:dateCreated"></span></td>
                            <td><span data-bind="text:type"></span> </td>
                        </tr>

                    </tbody>
                </table>
            </span>
        </div>
    </div>
</script>

<script type="text/javascript">

    $(function() {


        function findOutputByName(activity, name) {

            var output = ko.utils.arrayFirst(activity.outputs, function(output) {
                return output.name === name;
            });
            return output;

        }

        function getOutputValue(activity, outputName, dataItem) {

            var output = findOutputByName(activity, outputName);
            return output ? output.data[dataItem]?output.data[dataItem]:'' : '';
        };

        var monthlyReports = <fc:modelAsJavascript model="${monthlyActivities}"/>;
        var MonthlyReportViewModel = function(title, activities) {

            var self = this;

            var rows = [];

            console.log(title);
            console.log(activities);

            var header = [{sTitle:'Grant ID'}, {sTitle:'No. starting on projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCommencedNonIndigenous'}}];
            var totals = [];

            $.each(activities, function(i, activity) {

                var row = [];
                row.push(activity.grantId);
                for (var j=1; j<header.length; j++) {
                    row.push(getOutputValue(activity, header[j].source.output, header[j].source.dataItem));
                }
                rows.push(row);

            });

            self.title = title;
            self.initialise = function(element) {
                console.log(rows);
                $(element).find('.activityTable').dataTable( {
                    "aaData": rows,
                    "aoColumns": header
                } );
            };

        };

        var quarterlyReports = {'Q1':[], Q2:[], Q3:[], Q4:[]};
        var QuarterlyReportViewModel = function(activities) {
            this.initialise = function() {

            };
        };

        var reportCategories = [{type:'Green Army - Desktop Audit Checklist', title:'Audits undertaken'}, {type:'Green Army - Change or Absence of Team Supervisor', title:'Team supervisor notification'}, {type:'', title:'Other'}];

        var ProjectReportsViewModel = function(grantId, reports) {
            var self = this;
            self.grantId = grantId;
            self.reports = reports;

            self.counts = [];

            $.each(reportCategories, function() {
                self.counts.push(0);
            });

            // Do a count for each category.
            $.each(reports, function(i, report) {
                var index = -1;
                $.each(reportCategories, function(i, category) {
                    if (category.type == report.type) {
                        index = i;
                        return false;
                    }
                });
                if (index == -1) {
                    index = reportCategories.length - 1; // Assign to the "Other" category
                }
                self.counts[index]++;
            });

        };

        var AdHocReportsViewModel = function(projectReports) {


            var self = this;
            self.categories = $.map(reportCategories, function(category) {
                return category.title;
            });

            self.projects = [];

            $.each(projectReports, function(i, project) {
                self.projects.push(new ProjectReportsViewModel(project.grantId, project.reports));
            });

            self.selectedGrantId = ko.observable(self.projects[0].grantId);

            self.selectedProject = ko.computed(function() {
                var project = $.grep(self.projects, function(project) {
                    return project.grantId == self.selectedGrantId();
                });
                if (project[0]) {
                    return project[0];
                }
                return self.projects[0];
            });

            this.initialise = function() {};

        };

        var projectReports = <fc:modelAsJavascript model="${adHocReports}"/>;


        var ViewModel = function() {

            var self = this;

            var year = 2014;
            var title;
            <g:each in="${tabConfig}" var="tab">
            <g:if test="${tab.template == 'monthly'}">
            title = '${tab.title} '+(year+${tab.yearModifier});

            self.${tab.name}ViewModel = new MonthlyReportViewModel(title, monthlyReports[title]);
            </g:if>
            <g:if test="${tab.template == 'quarterly'}">
            self.${tab.name}ViewModel = new QuarterlyReportViewModel(quarterlyReports['${tab.name}']);
            </g:if>
            <g:if test="${tab.template == 'docsTemplate'}">
            self.${tab.name}ViewModel = new AdHocReportsViewModel(projectReports);
            </g:if>



            </g:each>

            self.initialise = function(element, model) {
                model.initialise(element);
            };
        };
        ko.applyBindings(new ViewModel(), document.getElementById('greenArmyReport'));


    });


    </script>

</div>




%{--<div>--}%

    %{--<fc:groupedTable elementId="gatable" scores="${--}%
        %{--['No. non indigenous participants starting accredited training', 'No. indigenous participants starting accredited training', 'No. non indigenous participants commencing non-accredited training', 'No. indigenous participants commencing non-accredited training',--}%
         %{--'No. of non indigenous Participants who exited training during period', 'No. of indigenous Participants who exited training during period', 'No. of non indigenous Participants who completed training in period', 'No. of indigenous Participants who completed training in period',--}%
        %{--'No. of non indigenous Participants who commenced projects in period', 'No. of indigenous Participants who commenced projects in period', 'No. of non indigenous Participants who did not complete projects in period', 'No. of indigenous Participants who did not complete projects in period',--}%
        %{--'No. of non indigenous Participants who completed projects in period', 'No. of indigenous Participants who completed projects in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%

%{--<div>--}%
    %{--Indigenous Training participation by Month--}%
    %{--<fc:groupedChart elementId="trainingchartindigenous" scores="${['No. indigenous participants starting accredited training', 'No. indigenous participants commencing non-accredited training', 'No. of indigenous Participants who exited training during period', 'No. of indigenous Participants who completed training in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%

%{--<div>--}%
    %{--Non-Indigenous Training participation by Month--}%
    %{--<fc:groupedChart elementId="trainingchartnonindigenous" scores="${['No. non indigenous participants starting accredited training', 'No. non indigenous participants commencing non-accredited training', 'No. of non indigenous Participants who exited training during period', 'No. of non indigenous Participants who completed training in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%


%{--<div>--}%
    %{--Indigenous Project participation by Month--}%
    %{--<fc:groupedChart elementId="projectchartindigenous" scores="${['No. of indigenous Participants who commenced projects in period', 'No. of indigenous Participants who did not complete projects in period', 'No. of indigenous Participants who completed projects in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%

%{--<div>--}%
    %{--Non-Indigenous Project participation by Month--}%
    %{--<fc:groupedChart elementId="projectchartnonindigenous" scores="${['No. of non indigenous Participants who commenced projects in period', 'No. of non indigenous Participants who did not complete projects in period', 'No. of Participants who completed Projects in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%


%{--<div>--}%


    %{--<g:each in="${report.outputData}" var="group">--}%

        %{--<div>--}%
            %{--<h4>${group.group}</h4>--}%
            %{--<g:each in="${group.results}" var="score">--}%
                %{--<fc:renderScore score="${score}"/>--}%
            %{--</g:each>--}%
        %{--</div>--}%


    %{--</g:each>--}%


%{--</div>--}%
</div>

<!-- /ko -->