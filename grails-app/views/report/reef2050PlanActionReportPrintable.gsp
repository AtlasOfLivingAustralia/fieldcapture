<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="nrmPrint"/>
    <title>Reef 2050 Action Status</title>
    <title>Reef 2050 Plan July 2017</title>
    <asset:stylesheet src="reef2050DashboardReport.css"/>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="homepage.css"/>
</head>

<body>
<div class="container-fluid">

    <g:if test="${flash.error || error}">
        <g:set var="error" value="${flash.error ?: error}"/>
        <div class="row-fluid">
            <div class="alert alert-error large-space-before">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <span>Error: ${error}</span>
            </div>
        </div>
    </g:if>

    <h3>Reef 2050 Plan Action Reporting</h3>
    <g:if test="${!actions}">
        <strong>No data was found.</strong>
    </g:if>

    <g:else>

        <div class="well">
            <strong>Progress on Reef 2050 Plan to <g:formatDate date="${endDate}" format="dd MMMM yyyy"/></strong>
        </div>

        <div class="report-section">
            <h3>Action count by status</h3>

            <div class="row-fluid">

                <div style="width:650px; display:inline-block;">
                    <table class="table">

                        <g:each in="${status}" var="s">
                            <tr class="status-row">
                                <td class="status-count" style="background-color: ${s.countColour}">${s.count}</td>
                                <td class="status-description"
                                    style="background-color: ${s.descriptionColour}">${s.description}</td>

                            </tr>
                        </g:each>

                    </table>

                </div>

                <div class="chart-plus-title" style="width:550px; display:inline-block;">
                    <fc:renderScore score="${actionStatus}" omitTitle="true" minResults="1"
                                    chartOptions="${[pieSliceText: 'value']}"
                                    sliceColoursByTitle="${statusColours}"/>
                </div>

            </div>
        </div>

        <div class="report-section theme-charts">

            <h3>Action status by theme</h3>

            <div class="row-fluid">
                <g:each in="${actionStatusByTheme}" var="theme">

                    <div class="small-chart">
                        <div style="height: 2em;"><strong>${theme.key}</strong></div>
                        <fc:renderScore score="${theme.value}" minResults="1" sliceColoursByTitle="${statusColours}"
                                        chartOptions="${[width: '150', height: '150', legend: 'none', pieSliceText: 'value', chartArea: [width: '90%', height: '100%']]}"
                                        omitTitle="true"/>

                    </div>
                </g:each>
            </div>
        </div>

        <div class="report-section">
    <h3>Action summary by theme</h3>
        <g:set var="actionsByTheme" value="${actions.groupBy { it.theme }}"/>
        <g:each in="${actionsByTheme}" var="actionsForTheme">
            <div class="themeActions">
            <h4>${actionsForTheme.key}</h4>
            <div class="row-fluid">
                <div class="span12">

                    <table class="action-table table table-striped">

                        <thead>

                        <tr>
                            <th class="actionId">Action ID</th>
                            <th class="action">Action</th>
                            <th class="leadAgency">Lead Agency</th>
                            <th class="status">Status</th>
                            <th class="description">Description</th>
                            <th class="actionProgress">Progress</th>
                            <th class="deliveryPartners">Delivery Partners</th>
                        </tr>
                        </thead>
                        <tbody>

                        <g:each in="${actionsForTheme.value}" var="action">
                            <tr>
                                <td class="actionId">${action.actionId}</td>
                                <td class="action">${action.actionDescription}</td>
                                <td class="leadAgency">${action.reportingLeadAgency}</td>
                                <td class="status">${action.status}</td>
                                <td class="description">${action.description}</td>
                                <td class="actionProgress">${action.progress}</td>
                                <td class="deliveryPartners">
                                    <g:if test="${action.deliveryPartners}">
                                    %{--This is because action.deliveryPartners is a JSONArray which will quote strings when performing a join--}%
                                        ${new ArrayList(action.deliveryPartners).join(', ')}
                                    </g:if>
                                </td>
                            </tr>
                        </g:each>
                        </tbody>
                    </table>

                </div>
            </div>
        </g:each>
        </div>

    </g:else>

</div>
</div>

</body>
</html>