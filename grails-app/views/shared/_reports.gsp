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
<table id="report" class="table">
    <thead>
        <tr>
            <th class="sorting">Grant ID</th>
            <th class="sorting">Programme</th>
            <th class="sorting">Sub-programme</th>
            <th class="sorting" width="30%">Project name</th>
            <th class="sorting">Organisation / Service Provider</th>
            <th class="sorting">Current Report Status</th>
            <th class="sorting">Current Phase</th>
            <th class="sorting">Average time of reoprting compared to due date</th>
            <th>Recommend as case study (tick box)</th>
        </tr>
    </thead>
    <tbody data-bind="foreach:projects">
        <tr>
            <td><a data-bind="attr:{href:fcConfig.projectViewUrl+'/'+projectId}"><span data-bind="text:grantId"></span></a></td>
            <td data-bind="text:associatedProgram"></td>
            <td data-bind="text:associatedSubProgram"></td>
            <td><a data-bind="attr:{href:fcConfig.projectViewUrl+'/'+projectId}"><span data-bind="text:name"></span></a></td>
            <td>
                <a data-bind="if:organisationId, attr:{href:fcConfig.organisationViewUrl+'/'+organisationId}"><span data-bind="text:organisationName"></span></a>
                <!-- ko if:!organisationId -->
                <span data-bind="text:organisationName"></span>
                <!-- /ko -->
            </td>
            <td style="position:relative;">
                <div data-bind="text:currentStatus, css:{late:isOverdue}" style="margin-right:2em;"></div><i style="position:absolute; right:1em; top:10px;" class="fa" data-bind="visible:extendedStatus.length>0, click:toggleExtendedStatus, css:{'fa-plus':!extendedStatusVisible(), 'fa-minus':extendedStatusVisible()}"></i>
                <ul class="unstyled" data-bind="visible:extendedStatusVisible">
                    <!-- ko foreach:extendedStatus -->
                    <hr/>
                    <li data-bind="text:$data"></li>
                    <!-- /ko -->
                </ul>

            </td>
            <td data-bind="text:meriPlanStatus()"></td>
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

    var table = $('#report').DataTable({displayLength:50, order:[[1,'asc']]});

});
</r:script>