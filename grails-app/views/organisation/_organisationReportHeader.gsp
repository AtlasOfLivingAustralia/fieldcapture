<h3 class="report-title">${report.description}</h3>

<div class="report-header">
    <div class="row mb-2">
        <div class="col-sm-2 header-label">Organisation</div>

        <div class="col-sm-9 value">${context.name}</div>
    </div>

    <div class="row mb-2">
        <div class="col-sm-2 header-label">Reporting period start</div>

        <div class="col-sm-9 value"><g:formatDate format="dd MMM yyyy"
                                         date="${au.org.ala.merit.DateUtils.parse(report.fromDate).toDate()}"/></div>
    </div>

    <div class="row mb-2">
        <div class="col-sm-2 header-label">Reporting period end</div>
        <g:if test="${context.config.organisationReports.periodEnd[0] && report.toDate < context.config.organisationReports.periodEnd[0]}">
            <div class="col-sm-9 value"><g:formatDate format="dd MMM yyyy"
                                                      date="${au.org.ala.merit.DateUtils.parse(report.toDate).minusDays(1).toDate()}"/></div>
        </g:if>
        <g:else>
            <div class="col-sm-9 value"><g:formatDate format="dd MMM yyyy"
                                                      date="${au.org.ala.merit.DateUtils.parse(report.toDate).toDate()}"/></div>
        </g:else>
    </div>
    <div class="row mb-2">
        <div class="col-sm-2 header-label">Report status</div>

        <div class="col-sm-9 value">
            <fc:reportStatus report="${report}"/>
        </div>
    </div>

    <g:if test="${printView}">
    <div class="row mb-2">
        <div class="col-sm-2 header-label">Report generated</div>

        <div class="col-sm-9 value"><g:formatDate format="yyyy-MM-dd HH:mm:ss" date="${new Date()}"/></div>
    </div>
    </g:if>

</div>
