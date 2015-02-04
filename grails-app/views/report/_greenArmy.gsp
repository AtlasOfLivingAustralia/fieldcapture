
<head>
    <style type="text/css">
        #Docs tr.selected td {
            background-color: #FFFFCC;
        }
        .dataTable th {
            white-space: normal;
        }

        #greenArmyReport table {
            width:100%;
        }
    </style>

</head>
<!-- ko stopBinding:true -->
<div id="greenArmyReport">
<h2>Green Army Reporting</h2>

<div class="row-fluid">
    <span class="span1">For financial year</span><span class="span1"><select name="financialYear"><option name="2014">2014/15</option></select></span><span class="span9"></span><span class="span1"><r:img dir="images" file="green_army_logo.png" alt="Green Army Logo"/></span>
</div>
<g:set var="tabConfig" value="${[[name:'Jul',template:'monthly',title:'July',yearModifier:0], [name:'Aug',template:'monthly', title:'August',yearModifier:0], [name:'Sep',template:'monthly', title:'September',yearModifier:0], [name:'Oct',template:'monthly', title:'October',yearModifier:0], [name:'Nov',template:'monthly',title:'November',yearModifier:0], [name:'Dec',template:'monthly',title:'December',yearModifier:0], [name:'Jan',template:'monthly',title:'January',yearModifier:1], [name:'Feb',template:'monthly', title:'February',yearModifier:1], [name:'Mar',template:'monthly',title:'March',yearModifier:1], [name:'Apr',template:'monthly', title:'April', yearModifier:1], [name:'May',template:'monthly', title:'May',yearModifier:1], [name:'Jun',template:'monthly', title:'June',yearModifier:1], [name:'Q1',template:'quarterly', yearModifier:0, title:'July - September'], [name:'Q2',template:'quarterly', title:'October - December', yearModifier:0], [name:'Q3',template:'quarterly', title:'January - March', yearModifier:1], [name:'Q4',template:'quarterly', title:'April - June', yearModifier:1], [name:'Docs',template:'docsTemplate']]}"/>
<div class="row-fluid">
    <span class="span12">
        <ul class="nav nav-tabs" data-tabs="tabs">
            <g:each in="${tabConfig}" var="tab" status="i">
                <li class="tab"><a id="${tab.name}-tab" data-toggle="tab" href="#${tab.name}">${tab.name}</a></li>
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
            <span class="span5">
                <h4>Projects</h4>
                <div class="row-fluid"><span class="span9">Total number of projects:</span><b><span class="span3" data-bind="text:numberOfProjects"></span></b></div>
                <div class="row-fluid"><span class="span9">Number of new projects:</span><b><span class="span3" data-bind="text:numberOfNewProjects"></span></b></div>
                <div class="row-fluid"><span class="span9">Number of projects completed in period:</span><b><span class="span3" data-bind="text:completedProjects"></span></b></div>
                <div class="row-fluid"><span class="span9">Number of projects not completed in period:</span><b><span class="span3" data-bind="text:numberOfProjects - completedProjects"></span></b></div>
                <div class="row-fluid"><span class="span9">Number of projects on track & MERIT updated:</span><b><span class="span3" data-bind="text:projectsOnTrack"></span></b></div>
                <div class="row-fluid"><span class="span9">Number of projects on track & MERIT not updated:</span><b><span class="span3" data-bind="text:projectsNotOnTrack"></span></b></div>

            </span>
            <span class="span7">
                <div class="row-fluid"><span class="span9"><h4>Participants and Training</h4></span><span class="span1"><b>Indigenous</b></span><span class="span1"><b>Non indigenous</b></span><span class="span1"><b>Total</b></span></div>
                <div class="row-fluid"><span class="span9">Number of participants who commenced on projects:</span><span class="span1" data-bind="text:scores['No. of indigenous Participants who commenced projects in period'] || 0"></span><span class="span1" data-bind="text:scores['No. of non indigenous Participants who commenced projects in period'] || 0"></span><span class="span1"><b data-bind="text:(scores['No. of non indigenous Participants who commenced projects in period'] || 0) + (scores['No. of indigenous Participants who commenced projects in period'] || 0)"></b></span></div>
                <div class="row-fluid"><span class="span9">Number of participants who did not complete projects in period:</span><span class="span1" data-bind="text:scores['No. of indigenous Participants who did not complete projects in period'] || 0"></span><span class="span1" data-bind="text:scores['No. of non indigenous Participants who did not complete projects in period'] || 0"></span><span class="span1"><b data-bind="text:(scores['No. of non indigenous Participants who did not complete projects in period'] || 0) + (scores['No. of indigenous Participants who did not complete projects in period'] || 0)"></b></span></div>
                <div class="row-fluid"><span class="span9">Number of participants who completed projects in period:</span><span class="span1" data-bind="text:scores['No. of indigenous Participants who completed projects in period'] || 0"></span><span class="span1" data-bind="text:scores['No. of non indigenous Participants who completed projects in period'] || 0"></span><span class="span1"><b data-bind="text:(scores['No. of non indigenous Participants who completed projects in period'] || 0) + (scores['No. of indigenous Participants who completed projects in period'] || 0)"></b></span></div>
                <div class="row-fluid"><span class="span9">Number of participants who commenced accredited training in period:</span><span class="span1" data-bind="text:scores['No. indigenous participants starting accredited training'] || 0"></span><span class="span1" data-bind="text:scores['No. non indigenous participants starting accredited training'] || 0"></span><span class="span1"><b data-bind="text:(scores['No. non indigenous participants starting accredited training'] || 0) + (scores['No. indigenous participants starting accredited training'] || 0)"></b></span></div>
                <div class="row-fluid"><span class="span9">Number of participants who exited training in period:</span><span class="span1" data-bind="text:scores['No. of indigenous Participants who exited training during period'] || 0"></span><span class="span1" data-bind="text:scores['No. of non indigenous Participants who exited training during period'] || 0"></span><span class="span1"><b data-bind="text:(scores['No. of non indigenous Participants who exited training during period'] || 0) + (scores['No. of indigenous Participants who exited training during period'] || 0)"></b></span></div>
                <div class="row-fluid"><span class="span9">Number of participants who completed training (accredited and non-accredited in period):</span><span class="span1" data-bind="text:scores['No. of indigenous Participants who completed training in period'] || 0"></span><span class="span1" data-bind="text:scores['No. of non indigenous Participants who completed training in period'] || 0"></span><span class="span1"><b data-bind="text:(scores['No. of non indigenous Participants who completed training in period'] || 0) + (scores['No. of indigenous Participants who did not complete projects in period'] || 0)"></b></span></div>

            </span>

        </div>
    </div>

    <div class="well">
        <h3>Project-by-project Monthly Report for ${date}</h3>
        <div class="row-fluid">
            <span class="span12">
                <table class="activityTable table-striped">
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
                <table  class="summaryTable table-striped">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Total projects</th>
                            <th>Projects completed</th>
                            <th>Projects not completed</th>
                            <th>No. starting on projects</th>
                            <th>No. not completing projects</th>
                            <th>No. completing projects</th>
                            <th>No. starting training</th>
                            <th>No. who exited training</th>
                            <th>No. who completed training</th>
                        </tr>

                    </thead>
                    <tbody data-bind="foreach:{data:quarterlyScores, as:'scores'}">
                        <tr>
                            <!-- ko foreach:$parent.scoreLabels -->
                            <td data-bind="text:scores[$data]"></td>
                            <!-- /ko -->
                        </tr>

                    </tbody>
                </table>
            </span>

        </div>

    </div>

    <div class="well">
        <h3>Project-by-project Quarterly Report for <span data-bind="text:title"></span></h3>
        <div class="row-fluid">
            <span class="span12">
                <table class="activityTable table-striped">
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
            <span class="span6">
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
            <span class="span6" data-bind="with:selectedProject">
                <strong>Documents for Project <span data-bind="text:$parent.selectedGrantId"></span></strong>
                <table style="width:100%;">
                    <thead>
                        <tr>
                            <th>Date attached</th>
                            <th>Document type</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach:reports">
                        <tr>
                            <td><span data-bind="text:dateCreated"></span></td>
                            <td><a data-bind="attr:{href:fcConfig.activityViewUrl+'/'+activityId}" title="View the document"><span data-bind="text:type"></span> </a></td>
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
        var quarterlyReports = <fc:modelAsJavascript model="${quarterlyReports}"/>;

        var MonthlyReportViewModel = function(title, activities, scores) {

            var self = this;

            var rows = [];

            var header = [
                {sTitle:'Grant ID'},
                {sTitle:'Project status', source:{output:'Monthly Status Report Data', dataItem:'projectStatus'}},
                {sTitle:'No. indigenous starting on projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCommencedIndigenous'}},
                {sTitle:'No. non indigenous starting on projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCommencedNonIndigenous'}},
                {sTitle:'No. indigenous not completing projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsNotCompletedIndigenous'}},
                {sTitle:'No. indigenous completing projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsNotCompletedNonIndigenous'}},
                {sTitle:'No. indigenous completing projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCompletedIndigenous'}},
                {sTitle:'No. non indigenous completing projects', source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCompletedNonIndigenous'}},
                {sTitle:'No. indigenous starting accredited training', source:{output:'Monthly Status Report Data', dataItem:'trainingCommencedAccreditedIndigenous'}},
                {sTitle:'No. non indigenous starting accredited training', source:{output:'Monthly Status Report Data', dataItem:'trainingCommencedAccreditedNonIndigenous'}},
                {sTitle:'No. indigenous who exited training', source:{output:'Monthly Status Report Data', dataItem:'trainingNoExitedIndigenous'}},
                {sTitle:'No. non indigenous who exited training', source:{output:'Monthly Status Report Data', dataItem:'trainingNoExitedNonIndigenous'}},
                {sTitle:'No. indigenous who completed training', source:{output:'Monthly Status Report Data', dataItem:'trainingNoCompletedIndigenous'}},
                {sTitle:'No. non indigenous who completed training', source:{output:'Monthly Status Report Data', dataItem:'trainingNoCompletedNonIndigenous'}}];

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
                $(element).find('.activityTable').dataTable( {
                    "aaData": rows,
                    "aoColumns": header
                } );
            };

            self.numberOfProjects = activities.length;

            self.scores = {};
            if (scores) {
                $.each(scores.results, function(i, score) {

                    if (score.results && score.results[0]) {
                        self.scores[score.results[0].label] = score.results[0].result;
                    }

                });
            }
            var projectsByStatus = self.scores['Count of projects by project status'];
            var newProjects = 0, completedProjects = 0, onTrack = 0, notOnTrack = 0;
            if (projectsByStatus && projectsByStatus.results && projectsByStatus.results[0]) {
                newProjects = projectByStatus.results[0].result['Commenced'] || 0;
                completedProjects = projectByStatus.results[0].result['Completed'] || 0;
                onTrack = (projectByStatus.results[0].result['Progressing - on schedule'] || 0) +
                          (projectByStatus.results[0].result['Progressing - ahead of schedule'] || 0);
                notOnTrack = (projectByStatus.results[0].result['Progressing - behind schedule'] || 0) +
                               (projectByStatus.results[0].result['Abandoned'] || 0);

            }

            self.numberOfNewProjects = newProjects;
            self.completedProjects = completedProjects;
            self.projectsOnTrack = onTrack;
            self.projectsNotOnTrack = notOnTrack;
        };

        var QuarterlyReportViewModel = function(title, activities, scores) {

            var self = this;
            self.title = title;

            var output = 'Three Monthly Report';
            var header = [
                {sTitle:'Grant ID'},
                {sTitle:'No. of incidents', source:{output:output, dataItem:'incidentCount'}},
                {sTitle:'No. of complaints', source:{output:output, dataItem:'complaintCount'}},
                {sTitle:'No. of training activities', source:{output:output, dataItem:'complaintCount'}},
                {sTitle:'No. of withdrawals', source:{output:output, dataItem:'complaintCount'}},
                {sTitle:'No. of exits', source:{output:output, dataItem:'complaintCount'}},
                {sTitle:'No. starting training', source:{output:output, dataItem:'complaintCount'}},
                {sTitle:'No. who exited training', source:{output:output, dataItem:'complaintCount'}},
                {sTitle:'17 yrs', source:{output:output, dataItem:'no17Years'}},
                {sTitle:'18 yrs', source:{output:output, dataItem:'no18Years'}},
                {sTitle:'19 yrs', source:{output:output, dataItem:'no19Years'}},
                {sTitle:'20 yrs', source:{output:output, dataItem:'no20Years'}},
                {sTitle:'21 yrs', source:{output:output, dataItem:'no21Years'}},
                {sTitle:'22 yrs', source:{output:output, dataItem:'no22Years'}},
                {sTitle:'23 yrs', source:{output:output, dataItem:'no23Years'}},
                {sTitle:'24 yrs', source:{output:output, dataItem:'no24Years'}},
                {sTitle:'Total participants', source:{output:output, dataItem:'totalParticipants'}}];

            var rows = [];
            $.each(activities, function(i, activity) {

                var row = [];
                row.push(activity.grantId);

                for (var j=1; j<header.length; j++) {
                    row.push(getOutputValue(activity, header[j].source.output, header[j].source.dataItem));
                }
                rows.push(row);

            });

            function findScoreByLabel(scores, label) {
                for (var i=0; i<scores.length; i++) {
                    if (scores[i].results && scores[i].results[0]) {
                        if (scores[i].results[0].label == label) {
                            return scores[i].results[0].result;
                        }
                    }
                }
            }
            self.scoreLabels = ['group', 'Total projects', ''];
            self.quarterlyScores = [];
            if (scores) {
                $.each(scores, function(i, groupedScores) {

                    var group = groupedScores.group;
                    console.log(group);
                    if (group.indexOf('Before') < 0 && group.indexOf('After') < 0) {
                        var row = {group:group};

                        for (var j=1; j<self.scoreLabels.length; j++) {
                            row[self.scoreLabels[j]] = findScoreByLabel(groupedScores.results, self.scoreLabels[j]);
                        }
                        self.quarterlyScores.push(row);
                    }
                });
            }
            console.log(self.quarterlyScores);

            this.initialise = function(element) {
                $(element).find('.activityTable').dataTable( {
                    "data": rows,
                    "columns": header
                } );
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
        var monthlySummaryScores = <fc:modelAsJavascript model="${monthlySummary.outputData}"/>;
        var quarterlySummaryScores = <fc:modelAsJavascript model="${quarterlySummary.outputData}"/>;


        var ViewModel = function() {

            var self = this;

            var year = 2014;
            var title;
            var shortTitle;
            <g:each in="${tabConfig}" var="tab">

            <g:if test="${tab.template != 'docsTemplate'}">
            var tabYear = year+${tab.yearModifier};
            title = '${tab.title} '+ tabYear;
            shortTitle = '${tab.name} ' + tabYear;

            <g:if test="${tab.template == 'monthly'}">
            var monthlyScores = $.grep(monthlySummaryScores, function(results) {
                return results.group == shortTitle;
            })[0];

            self.${tab.name}ViewModel = new MonthlyReportViewModel(title, monthlyReports[title], monthlyScores);
            </g:if>
            <g:if test="${tab.template == 'quarterly'}">
            self.${tab.name}ViewModel = new QuarterlyReportViewModel(title, quarterlyReports['${tab.name}'], quarterlySummaryScores);
            </g:if>
            </g:if>
            <g:if test="${tab.template == 'docsTemplate'}">
            self.${tab.name}ViewModel = new AdHocReportsViewModel(projectReports);
            </g:if>



            </g:each>

            self.initialise = function(element, model) {
                model.initialise(element);

            };
            $('#${tabConfig[0].name}-tab').click();
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