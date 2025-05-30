<g:if test="${projects}">
    <h3>Project reporting</h3>
    <table id="projectList" class="table table-striped table-bordered">
        <thead class="thead-light">
        <th class="projectId">${g.message(code:'label.merit.projectID')}</th>
        <th class="internalOrderId"><g:message code="label.externalId.INTERNAL_ORDER_NUMBER"/> / <g:message code="label.externalId.TECH_ONE_CODE"/></th>
        <th class="name">Name</th>
        <th class="startDate">Start Date</th>
        <th class="endDate">End Date</th>
        <th class="statusCol">Status</th>
        </thead>
        <tbody>
        <g:each var="project" in="${projects}">
            <tr>
                <td class="projectLink"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.grantId}</a></td>
                <td class="internalOrderId">
                    <fc:externalIds externalIds="${project.externalIds}" idType="INTERNAL_ORDER_NUMBER"/>
                    <fc:externalIds externalIds="${project.externalIds}" idType="TECH_ONE_CODE"/>
                </td>
                <td class="name">${project.name?.encodeAsHTML()}</td>
                <td class="startDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedStartDate)}</td>
                <td class="endDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedEndDate)}</td>
                <td class="statusCol"><fc:status status="${project.status}"/></td>
            </tr>
        </g:each>
        </tbody>
    </table>
</g:if>
<g:else>
    <div class="row">
        <span class="col-sm"><h4>${program.name?.encodeAsHTML()} is not currently running any projects.</h4></span>
    </div>
</g:else>

<!-- ko stopBinding:true -->
<g:render template="/shared/categorizedReporting"/>

<g:render template="/shared/declaration_bs4" model="${[declarationType:au.org.ala.merit.SettingPageType.RLP_REPORT_DECLARATION]}"/>
<!-- /ko -->
