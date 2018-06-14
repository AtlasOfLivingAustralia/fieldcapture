<g:if test="${projects}">
    <h3>Project reporting</h3>
    <table id="projectList" class="table table-striped table-bordered">
        <thead class="thead-light">
            <th class="projectId">Project ID</th>
            <th class="name">Name</th>
            <th class="startDate">Start Date</th>
            <th class="endDate">End Date</th>
            <th class="statusCol">Status</th>
        </thead>
        <tbody>
            <g:each var="project" in="${projects}">
                <tr>
                    <td class="projectId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.externalId ?: project.grantId}</a></td>
                    <td class="name">${project.name}</td>
                    <td class="startDate"><fc:formatDateString date="${project.plannedStartDate}" format="dd-MM-yyyy"/></td>
                    <td class="endDate"><fc:formatDateString date="${project.plannedEndDate}" format="dd-MM-yyyy"/></td>
                    <td class="statusCol"><fc:status status="${project.status}"/></td>
                </tr>
            </g:each>
        </tbody>
    </table>
</g:if>
<g:else>
    <div class="row">
        <span class="col-sm"><h4>${program.name} is not currently running any projects.</h4></span>
    </div>
</g:else>

<!-- ko stopBinding:true -->
<g:render template="/shared/categorizedReporting"/>

<g:render template="/shared/declaration_bs4" model="${[declarationType:au.org.ala.merit.SettingPageType.RLP_REPORT_DECLARATION]}"/>
<!-- /ko -->