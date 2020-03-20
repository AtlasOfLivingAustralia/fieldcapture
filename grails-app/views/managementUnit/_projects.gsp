
<div class="projects-wrapper d-none d-md-block">
    <g:if test="${displayedPrograms}">
       <g:each var="programDetails" status="i" in="${displayedPrograms}">
           <g:set var="program" value="${programDetails.program}"/>
            <div class="well-title">Project reporting in program: ${program.name} %{--  <a href="${g.createLink(controller: 'program', action: 'index',id:program.programId)}">${program.name}</a> --}% </div>
            <table id="projectList-${i}" class="table table-striped table-bordered">
                <thead class="thead-light">
                <th class="projectId">Project ID</th>
                <th class="workOrderId">Internal order number</th>
                <th class="name">Name</th>
                <th class="startDate">Start Date</th>
                <th class="endDate">End Date</th>
                <th class="statusCol">Status</th>
                </thead>
                <tbody>
                <g:each var="project" in="${programDetails.projects}">
                    <tr>
                        <td class="projectId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.externalId ?: project.grantId}</a></td>
                        <td class="workOrderId">${project.workOrderId}</td>
                        <td class="name">${project.name}</td>
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

<!-- ko stopBinding:true -->
<g:render template="/shared/categorizedReporting"/>

<g:render template="/shared/declaration_bs4" model="${[declarationType:au.org.ala.merit.SettingPageType.RLP_REPORT_DECLARATION]}"/>
<!-- /ko -->