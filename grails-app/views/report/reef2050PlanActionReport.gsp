<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>Reef 2050 Action Status</title>
    <title></title>
    <link href="${g.resource(dir:'css', file:'reef2050DashboardReport.css')}" type="text/css" rel="stylesheet">
</head>

<body>

    <g:if test="${flash.error || error}">
        <g:set var="error" value="${flash.error ?: error}"/>
        <div class="row-fluid">
            <div class="alert alert-error large-space-before">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <span>Error: ${error}</span>
            </div>
        </div>
    </g:if>

    <div class="well">
        <form>
            <div class="row-fluid">
                <span class="span3">
                    <label for="year">Select the financial year to view:</label><g:select name="year" from="${years}"
                                                                                          optionValue="label"
                                                                                          optionKey="value"
                                                                                          value="${year}"></g:select>
                </span>
            </div>

            <div class="row-fluid">
                <button type="submit" class="btn btn-success bottom">Update</button>
            </div>
        </form>
    </div>

    <g:if test="${!actions}">
        <strong>No data was found for the selected year.</strong>
    </g:if>
    <g:else>

        <h3>Reef 2050 Plan Action Reporting</h3>

        <p>Results for the financial year ${year} / ${year + 1}.  Please note this report ignores any facet selection you may have made.</p>

        <div class="report-section">
            <h3>Action count by status</h3>

            <div class="row-fluid">

                <div class="span7">
                    <table class="table">

                        <g:each in="${status}" var="s">
                            <tr>
                                <td class="status-count" style="background-color: ${s.countColour}">${s.count}</td>
                                <td class="status-description"
                                    style="background-color: ${s.descriptionColour}">${s.description}</td>

                            </tr>
                        </g:each>

                    </table>

                </div>

                <div class="span5">
                    <fc:renderScore score="${actionStatus}" omitTitle="true" minResults="1"
                                    sliceColoursByTitle="${statusColours}"/>
                </div>

            </div>
        </div>

        <div class="report-section">

            <h3>Action status by theme</h3>

            <div class="row-fluid">
                <g:each in="${actionStatusByTheme}" var="theme">

                    <div class="span1" style="width:12%; text-align:center">
                        <div style="height: 2em;"><strong>${theme.key}</strong></div>
                        <fc:renderScore score="${theme.value}" minResults="1" sliceColoursByTitle="${statusColours}"
                                        chartOptions="${[width: '100%', height: '100%', legend: 'none', chartArea: [width: '90%', height: '100%']]}"
                                        omitTitle="true"/>

                    </div>
                </g:each>
            </div>
        </div>

        <div class="report-section">
    <h3>Action summary</h3>

        <div class="row-fluid">
            <div class="span12" style="overflow-x:scroll;">
                <table class="action-table table table-striped">
                    <thead>
                    <tr>Action summary</tr>
                    <tr>
                        <th>Action ID</th>
                        <th>Action description</th>
                        <th>Lead Agency</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Progress</th>
                        <th>Weblink</th>
                        <th>Supporting Agencies</th>
                        <th>Contributing Partners</th>
                        <th>Priority</th>
                    </tr>
                    </thead>
                    <tbody>
        <g:each in="${actions}" var="action">
            <tr>
                <td>${action.actionId}</td>
                <td>${action.actionDescription}</td>
                <td>${action.reportingLeadAgency}</td>
                <td>${action.status}</td>
                <td>${action.description}</td>
                <td>${action.progress}</td>
            <td><g:if test="${action.webLink}"><a href="${action.webLink}">${action.webLink}</a></td></g:if>
                <td>${action.supportingAgencies?.join(', ')}</td>
                <td>${action.contributingPartners?.join(', ')}</td>
                <td>${action.priority}</td>
            </tr>
        </g:each>
        </tbody>
    </table>
</div>
</div>

    </g:else>

</div>

<script type="text/javascript">
    $('table.action-table').dataTable({
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ]
    });
</script>

</body>
</html>