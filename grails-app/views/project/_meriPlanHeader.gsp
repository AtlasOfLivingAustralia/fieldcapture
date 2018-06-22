<h3>Project MERI Plan</h3>

<div class="overview">
    <div class="row-fluid">
        <div class="span3 title">Project Name</div>

        <div class="span9">${project.name}</div>
    </div>

    <div class="row-fluid">
        <div class="span3 title">Program</div>

        <div class="span9">${project.associatedProgram} <g:if test="${project.associatedSubProgram}"> - ${project.associatedSubProgram}</g:if></div>
    </div>

    <div class="row-fluid">
        <div class="span3 title">Grant ID</div>

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
</div>