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
        <%--
             The reason this check is necessary is the reporting end date is selected by the user using a
             date picker.  The date picker sets the time to 00:00:00.  This means that the date selected for the
             final report ends up being midnight at the start of the final day.  All generated reports will
             use midnight at the start of the day after the end date.  This means that when we display the
             report end date for generated reports we should use the day before the actual end date,
             except for the final report.
             Note that for organisationReports, the selected end date is stored as the "periodEnd" for all
             generated reporting periods which is why using the first one is sufficient.
        --%>
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
