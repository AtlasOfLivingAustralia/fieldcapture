<h3 class="report-title">${report.description}</h3>

<div class="report-header">
    <div class="row mb-2">
        <div class="col-sm-2 header-label">Organisation Management Unit</div>

        <div class="col-sm-9 value">${context.name}</div>
    </div>
    <g:if test="${context.associatedOrganisations}">
        <div class="row mb-2">
            <div class="col-sm-2 header-label">Service provider</div>

            <div class="col-sm-9 value">${context.associatedOrganisations[0].name}</div>
        </div>
    </g:if>

    <div class="row mb-2">
        <div class="col-sm-2 header-label">Reporting period start</div>

        <div class="col-sm-9 value"><g:formatDate format="dd MMM yyyy"
                                         date="${au.org.ala.merit.DateUtils.parse(report.fromDate).toDate()}"/></div>
    </div>

    <div class="row mb-2">
        <div class="col-sm-2 header-label">Reporting period end</div>

        <div class="col-sm-9 value"><g:formatDate format="dd MMM yyyy"
                                         date="${au.org.ala.merit.DateUtils.parse(report.toDate).toDate()}"/></div>
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
