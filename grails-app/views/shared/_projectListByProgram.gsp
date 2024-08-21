<g:if test="${reportsFirst}">
    <g:render template="/shared/categorizedReportsAndDeclaration"/>
</g:if>
<div class="projects-wrapper">
    <g:if test="${displayedPrograms}">
        <g:each var="programDetails" status="i" in="${displayedPrograms}">
            <g:set var="program" value="${programDetails.program}"/>
            <div class="well-title">Project reporting in program: ${program.name?.encodeAsHTML()} %{--  <a href="${g.createLink(controller: 'program', action: 'index',id:program.programId)}">${program.name?.encodeAsHTML()}</a> --}% </div>
            <table id="projectList-${i}" class="table table-striped table-bordered">
                <thead class="thead-light">
                <th class="projectId">${g.message(code:'label.merit.projectID')}</th>
                <th class="internalOrderId"><g:message code="label.externalId.INTERNAL_ORDER_NUMBER"/></th>
                <th class="techOneCode"><g:message code="label.externalId.TECH_ONE_CODE"/></th>
                <th class="name">Name</th>
                <th class="startDate">Start Date</th>
                <th class="endDate">End Date</th>
                <th class="statusCol">Status</th>
                </thead>
                <tbody>
                <g:each var="project" in="${programDetails.projects}">
                    <tr>
                        <td class="projectId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.grantId}</a></td>
                        <td class="internalOrderId"><fc:externalIds externalIds="${project.externalIds}" idType="INTERNAL_ORDER_NUMBER"/></td>
                        <td class="internalOrderId"><fc:externalIds externalIds="${project.externalIds}" idType="TECH_ONE_CODE"/></td>
                        <td class="name">${project.name?.encodeAsHTML()}</td>
                        <td class="startDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedStartDate)}</td>
                        <td class="endDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedEndDate)}</td>
                        <td class="statusCol"><fc:status status="${project.status}"/></td>
                    </tr>
                </g:each>
                </tbody>
            </table>
        </g:each>
    </g:if>
</div>

<g:if test="${!reportsFirst}">
    <g:render template="/shared/categorizedReportsAndDeclaration"/>
</g:if>
