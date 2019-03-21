<%@ page import="org.joda.time.DateTimeZone" contentType="text/html;charset=UTF-8" %>


<g:if test="${flash.error || error}">
    <g:set var="error" value="${flash.error ?: error}"/>
    <div class="row-fluid">
        <div class="alert alert-error large-space-before">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span>Error: ${error}</span>
        </div>
    </div>
</g:if>


<g:if test="${reportText}">
    <markdown:renderHtml text="${reportText}"/>
</g:if>
<g:else>

    <g:if test="${!actions}">
        <strong>No data was found.</strong>
    </g:if>
    <g:else>

        <div class="well">
            <strong>Progress on Reef 2050 Plan for the period <g:formatDate date="${startDate}"
                                                                            format="MMMM"/> to <g:formatDate
                    date="${endDate}" format="dd MMMM yyyy"/></strong>

            <p>
                Please note this report ignores any facet selection you may have made.
            </p>
        </div>

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
                                    chartOptions="${[pieSliceText: 'value']}"
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
                                        chartOptions="${[width: '100%', height: '100%', legend: 'none', pieSliceText: 'value', chartArea: [width: '90%', height: '100%']]}"
                                        omitTitle="true"/>

                    </div>
                </g:each>
            </div>
        </div>

        <div class="report-section">
    <h3>Action summary</h3>

        <div class="row-fluid">
            <div class="span12">
                <table class="actions ${tableClass} table table-striped">

                    <thead>

                    <tr>
                        <th class="actionId">Action ID</th>
                        <th class="hidden"></th>
                        <th class="action">Action</th>
                        <th class="leadAgency">Lead Agency</th>
                        <th class="status">Status</th>
                        <g:if test="${type != au.org.ala.merit.reports.Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE}">
                        <th class="description">Description</th>
                        </g:if>
                        <th class="actionProgress">Progress</th>
                        <th class="webLink">Web Link</th>
                        <th class="deliveryPartners">Delivery Partners</th>
                    </tr>
                    </thead>
                    <tbody>
        <g:each in="${actions}" var="action">
            <tr>
                <td class="actionId">${action.actionId}</td>
                <td class="hidden">${action.sortableActionId}</td>
                <td class="action">${action.actionDescription}</td>
                <td class="leadAgency">
                    <g:if test="${action.organisationId}">
                        <g:link controller="organisation" action="index"
                                id="${action.organisationId}">${action.reportingAgency}</g:link>
                    </g:if>
                    <g:else>
                        ${action.reportingAgency}
                    </g:else>

                </td>
                <td class="status">${action.status}</td>
                <g:if test="${type != au.org.ala.merit.reports.Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_2018_ACTIVITY_TYPE}">
                <td class="description">${action.description}</td>
                </g:if>
                <td class="actionProgress">${action.progress}</td>
                <td class="webLink">
                    <g:if test="${action.webLinks}">
                        <g:each in="${action.webLinks}" var="webLink" status="i">
                            <a href="${webLink?.trim()}" title="${webLink?.trim()}" target="_blank">${i + 1}</a><g:if
                                test="${i < action.webLinks.size() - 1}">,</g:if>

                        </g:each>
                    </g:if>
                </td>
                <td class="deliveryPartners">
                    <g:if test="${action.deliveryPartners}">
                    %{--This is because action.deliveryPartners is a JSONArray which will quote strings when peforming a join--}%
                        ${new ArrayList(action.deliveryPartners).join(', ')}
                    </g:if>
                </td>
            </tr>
        </g:each>
        </tbody>
    </table>
</div>
</div>

    </g:else>

</g:else>


</div>
