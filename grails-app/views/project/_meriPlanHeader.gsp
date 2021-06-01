<h3>Project MERI Plan</h3>

<div class="overview">
    <div class="row">
        <div class="col-sm-3 title">Project Name</div>

        <div class="col-sm-9">${project.name}</div>
    </div>

    <div class="row">
        <div class="col-sm-3 title">Program</div>

        <div class="col-sm-9">${project.associatedProgram} <g:if test="${project.associatedSubProgram}"> - ${project.associatedSubProgram}</g:if></div>
    </div>

    <div class="row">
        <div class="col-sm-3 title">Grant ID</div>

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
</div>
