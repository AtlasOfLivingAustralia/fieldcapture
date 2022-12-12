<h3>${report.description}</h3>
<div class="report-header">
    <div class="row mb-2">
        <div class="col-sm-2 header-label">Program name</div>
        <div class="col-sm-9">${context?.associatedProgram} <g:if test="${context?.associatedSubProgram}"> - ${context?.associatedSubProgram}</g:if></div>
    </div>
    <div class="row mb-2">
        <div class="col-sm-2 header-label">Management Unit</div>
        <div class="col-sm-9">${context?.managementUnitName}</div>
    </div>

    <g:if test="${context.organisationName}">
        <div class="row mb-2">
            <div class="col-sm-2 header-label">Service provider</div>

            <div class="col-sm-9">${context.organisationName}</div>
        </div>
    </g:if>

    <div class="row mb-2">
        <div class="col-sm-2 header-label">Project Name</div>

        <div class="col-sm-9">${context.name}</div>
    </div>

    <div class="row mb-2">
        <div class="col-sm-2 header-label">${g.message(code:'label.merit.projectID')}</div>

        <div class="col-sm-9">${context.grantId}</div>
    </div>


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
