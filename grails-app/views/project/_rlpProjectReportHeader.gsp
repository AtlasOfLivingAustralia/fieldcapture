<h3>${report.description}</h3>
<div class="report-header">

    <div class="row-fluid">
        <div class="span2 header-label">Management Unit</div>

        <div class="span9">${config?.program?.name}</div>
    </div>

    <g:if test="${context.organisationName}">
    <div class="row-fluid">
        <div class="span2 header-label">Service provider</div>

        <div class="span9">${context.organisationName}</div>
    </div>
    </g:if>

    <div class="row-fluid">
        <div class="span2 header-label">Project Name</div>

        <div class="span9">${context.name}</div>
    </div>

    <div class="row-fluid">
        <div class="span2 header-label">Project ID</div>

        <div class="span9">${context.grantId}</div>
    </div>


    <div class="row-fluid">
        <div class="span2 header-label">Reporting period start</div>

        <div class="span9 value"><g:formatDate format="dd MMM yyyy"
                                               date="${au.org.ala.merit.DateUtils.parse(report.fromDate).toDate()}"/></div>
    </div>

    <div class="row-fluid">
        <div class="span2 header-label">Reporting period end</div>

        <div class="span9 value"><g:formatDate format="dd MMM yyyy"
                                               date="${au.org.ala.merit.DateUtils.parse(report.toDate).toDate()}"/></div>
    </div>

    <div class="row-fluid">
        <div class="span2 header-label">Report status</div>

        <div class="span9 value">
            <fc:reportStatus report="${report}"/>
        </div>
    </div>

    <g:if test="${printView}">
        <div class="row-fluid">
            <div class="span2 header-label">Report generated</div>

            <div class="span9 value"><g:formatDate format="yyyy-MM-dd HH:mm:ss" date="${new Date()}"/></div>
        </div>
    </g:if>

</div>
