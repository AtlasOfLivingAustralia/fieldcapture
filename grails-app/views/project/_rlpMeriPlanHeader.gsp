<h3>Attachment 1 to Schedule 7 – Project MERI Plan</h3>

<div class="overview">
    <div class="row">
        <div class="col-sm-3 title">Project name</div>

        <div class="col-sm-9">${project.name}</div>
    </div>

    <div class="row">
        <div class="col-sm-3 title">Management Unit</div>

        <div class="col-sm-9">${config?.program?.name}</div>
    </div>

    <g:if test="${project.organisationName}">
        <div class="row">
            <div class="col-sm-3 title">Service provider</div>

            <div class="col-sm-9">${project.organisationName}</div>
        </div>
    </g:if>

    <div class="row">
        <div class="col-sm-3 title">${g.message(code:'label.merit.projectID')}</div>

        <div class="col-sm-9">${project.grantId}</div>
    </div>

    <div class="row">
        <div class="col-sm-3 title">Project start</div>

        <div class="col-sm-9"><g:formatDate format="dd MMM yyyy"
                                            date="${au.org.ala.merit.DateUtils.parse(project.plannedStartDate).toDate()}"/></div>
    </div>

    <div class="row">
        <div class="col-sm-3 title">Project finish</div>

        <div class="col-sm-9"><g:formatDate format="dd MMM yyyy"
                                            date="${au.org.ala.merit.DateUtils.parse(project.plannedEndDate).toDate()}"/></div>
    </div>
    <div class="row">
        <div class="col-sm-3 title">MERI Plan generated</div>
        <div class="col-sm-9"><g:formatDate format="yyyy-MM-dd HH:mm:ss" date="${new Date()}"/></div>
    </div>

</div>
