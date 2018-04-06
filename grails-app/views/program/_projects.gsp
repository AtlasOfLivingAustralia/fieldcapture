<g:if test="${projects}">
    <table id="projectList" class="table table-striped table-bordered">
        <thead class="thead-light">
            <th class="projectId">Project ID</th>
            <th class="name">Name</th>
            <th class="startDate">Start Date</th>
            <th class="endDate">End Date</th>
            <th class="statusCol">Status</th>
            <th class="cost">Cost (GST exclusive)</th>
        </thead>
        <tbody>
            <g:each var="project" in="${projects}">
                <tr>
                    <td class="projectId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.externalId}</a></td>
                    <td class="name">${project.name}</td>
                    <td class="startDate"><fc:formatDateString date="${project.plannedStartDate}" format="dd-MM-yyyy"/></td>
                    <td class="endDate"><fc:formatDateString date="${project.plannedEndDate}" format="dd-MM-yyyy"/></td>
                    <td class="statusCol"><fc:status status="${project.status}"/></td>
                    <td class="cost"><g:formatNumber number="${fc.projectFunding(project:project)}" maxFractionDigits="0"/></td>
                </tr>
            </g:each>
        </tbody>
    </table>
</g:if>
<g:else>
    <div class="row-fluid">
        <span class="span12"><h4>${program.name} is not currently running any projects.</h4></span>
    </div>
</g:else>