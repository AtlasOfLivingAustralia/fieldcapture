<r:require modules="jquery_bootstrap_datatable, merit_projects"/>
<style type="text/css">
    #report th, #report td {
        white-space: normal;
    }
    .early {
        color:green;
    }
    .late {
        color:red;
    }
</style>
<table id="report">
    <thead>
        <tr>
            <th>Grant ID</th>
            <th>Programme</th>
            <th>Sub-programme</th>
            <th>Project name</th>
            <th>Organisation / Service Provider</th>
            <th>Current Report Status</th>
            <th>Current Phase</th>
            <th>Average time of reoprting compared to due date</th>
            <th>Recommend as case study (tick box)</th>
        </tr>
    </thead>
    <tbody data-bind="foreach:projects">
        <tr>
            <td><a data-bind="attr:{href:fcConfig.projectViewUrl+'/'+projectId}"><span data-bind="text:grantId"></span></a></td>
            <td data-bind="text:associatedProgram"></td>
            <td data-bind="text:associatedSubProgram"></td>
            <td><a data-bind="attr:{href:fcConfig.projectViewUrl+'/'+projectId}"><span data-bind="text:name"></span></a></td>
            <td><a data-bind="attr:{href:fcConfig.organisationViewUrl+'/'+organisationId}"><span data-bind="text:organisationName"></span></a></td>
            <td data-bind="text:currentStatus, css:{late:isOverdue}"></td>
            <td data-bind="text:currentPhase"></td>
            <td data-bind="click:toggleHistory"><span data-bind="html:averageReportingTimeText()"></span> <br/><em data-bind="visible:!historyVisible()">Show history <i class="icon-plus"></i></em><em data-bind="visible:historyVisible()">Hide history <i class="icon-minus"></i></em></td>
            <td><label class="checkbox"><input type="checkbox" data-bind="checked:recommendAsCaseStudy"><span data-bind="visible:savingCaseStudy"><r:img dir="images" file="ajax-saver.gif" alt="saving icon"/> saving</span></label></td>
        </tr>
</tbody>
</table>

<table id="dataTable" data-bind="delegatedHandler: 'click'"></table>

<r:script>
$(function() {


    var projects = <fc:modelAsJavascript model="${memberProjects}"/>;
    var viewModel = new ProjectReportingViewModel(projects);

    ko.applyBindings(viewModel, document.getElementById('report'));

    var table = $('#report').DataTable();

});
</r:script>