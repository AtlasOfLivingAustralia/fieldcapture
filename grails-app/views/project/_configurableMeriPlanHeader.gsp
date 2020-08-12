<h3>Project MERI Plan</h3>

<div class="overview">
    <div class="row-fluid">
        <div class="span3 title">Project Name</div>

        <div class="span9">${project.name}</div>
    </div>

    <g:if test="${config?.program?.name}">
    <div class="row-fluid">
        <div class="span3 title">Program</div>
        <div class="span9">${config?.program?.name}</div>
    </div>
    </g:if>

    <div class="row-fluid">
        <div class="span3 title">Project ID</div>

        <div class="span9">${project.grantId}</div>
    </div>

    <div class="row-fluid">
        <div class="span3 title">Project start</div>

        <div class="span9"><g:formatDate format="dd MMM yyyy"
                                         date="${au.org.ala.merit.DateUtils.parse(project.plannedStartDate).toDate()}"/></div>
    </div>

    <div class="row-fluid">
        <div class="span3 title">Project finish</div>

        <div class="span9"><g:formatDate format="dd MMM yyyy"
                                         date="${au.org.ala.merit.DateUtils.parse(project.plannedEndDate).toDate()}"/></div>
    </div>
    <div class="row-fluid">
        <div class="span3 title">MERI Plan generated</div>
        <div class="span9"><g:formatDate format="yyyy-MM-dd HH:mm:ss" date="${new Date()}"/></div>
    </div>
</div>