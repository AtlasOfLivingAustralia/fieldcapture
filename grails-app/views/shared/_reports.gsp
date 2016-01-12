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

    td .layout-container {
        width:100%;
        height:100%;
        position: relative;
    }

    td .layout-container em {
        margin-right:1.5em;
        display: block;
    }

    td .see-more {
        position: absolute;
        top:3px;
        right:0;
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
            <th class="sorting">Reporting History</th>
            <g:if test="${allowProjectRecommendation}">
            <th>Recommend as case study (tick box)</th>
            </g:if>
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
            <td>
                <div class="layout-container">
                <div data-bind="text:currentStatus, css:{late:isOverdue}" style="margin-right:2em;"></div><i class="see-more fa pointer" data-bind="visible:extendedStatus.length>0, click:toggleExtendedStatus, css:{'fa-plus':!extendedStatusVisible(), 'fa-minus':extendedStatusVisible()}"></i>
                <ul class="unstyled" data-bind="visible:extendedStatusVisible">
                    <!-- ko foreach:extendedStatus -->
                    <hr/>
                    <li data-bind="text:$data"></li>
                    <!-- /ko -->
                </ul>
                </div>

            </td>
            <td data-bind="text:meriPlanStatus()"></td>
            <td data-bind="click:toggleHistory">
                <div class="layout-container">
                    <em data-bind="visible:!historyVisible()">Show history </em><i class="see-more icon-plus pointer"></i><em data-bind="visible:historyVisible()">Hide history </em><i class="icon-minus see-more pointer"></i>
                </div>
            </td>
            <g:if test="${allowProjectRecommendation}">
            <td><label class="checkbox"><input type="checkbox" data-bind="checked:recommendAsCaseStudy"><span data-bind="visible:savingCaseStudy"><r:img dir="images" file="ajax-saver.gif" alt="saving icon"/> saving</span></label></td>
            </g:if>
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