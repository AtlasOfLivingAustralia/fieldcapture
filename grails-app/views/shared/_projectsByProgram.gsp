<g:if test="${displayedPrograms}">
<div class="projects-wrapper d-none d-md-block">
    <div class="well-title">Programs</div>

    <ul class="nav nav-tabs" id="programs-tab" >
        <g:each in="${displayedPrograms}" var="programDetails" status="i">
            <g:set var="program" value="${programDetails.program}"/>
            <li class="nav-item">
                <g:set var="active" value="${i==0?'active':''}"/>
                <a class="nav-link ${active}"  data-toggle="tab" href="#program_${program.programId}_projects" role="tab">${program.name?.encodeAsHTML()}</a>

            </li>
        </g:each>

    </ul>

    <div class="tab-content" id="programs-TabContent">
        <g:each in="${displayedPrograms}" var="programDetails" status="i">
            <g:set var="program" value="${programDetails.program}"/>
            <g:set var="active" value="${i==0?'active':''}"/>
            <div class="tab-pane ${active}" id="program_${program.programId}_projects" >
                <g:if test="${programDetails.primaryOutcomes}">
                    <g:render template="/shared/outcomes" model="${[type:"primary", outcomes:programDetails.primaryOutcomes]}"/>
                    <hr/>
                </g:if>
                <g:if test="${programDetails.secondaryOutcomes}">
                    <g:render template="/shared/outcomes" model="${[type:"secondary", outcomes:programDetails.secondaryOutcomes, title:"The Service Provider is addressing these secondary outcomes"]}"/>
                    <hr/>
                </g:if>

                <div class="well-title">Projects in this program  <a class="gotoProgram" href="${g.createLink(controller: 'program', action: 'index',id:program.programId)}"><i class="fa fa-link"></i></a></div>
                <table id="projectOverviewList-${i}" class="table table-striped table-bordered">
                    <thead class="thead-light">
                    <th class="projectId">${g.message(code:'label.merit.projectID')}</th>
                    <th class="name">Name</th>
                    <th class="description">Description</th>
                    <th class="outcomes">Outcome</th>
                    <th class="priority">Investment Priority</th>
                    <th class="startDate">Start Date</th>
                    <th class="endDate">End Date</th>
                    </thead>
                    <tbody>
                    <g:each in="${programDetails.projects}" var="project">
                        <tr>
                            <td class="grantId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.grantId}</a></td>
                            <td class="projectName">${project.name?.encodeAsHTML()}</td>
                            <td class="projectDescription">${project.description}</td>
                            <g:if test="${project.custom?.details?.outcomes?.primaryOutcome}">
                                <g:set var="primaryOutcome" value="${project.custom.details.outcomes.primaryOutcome}" />
                                <td class="outcomes">${primaryOutcome.shortDescription}</td>
                                <g:set var="primaryOutcomePriorities" value="${primaryOutcome.assets}"></g:set>
                                <td class="priority">
                                    <g:each var="priority" in="${primaryOutcomePriorities}">
                                        ${priority}
                                    </g:each>
                                </td>
                            </g:if>
                            <g:else>
                                <td></td>
                                <td></td>
                            </g:else>
                            <td class="startDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedStartDate)}</td>
                            <td class="endDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedEndDate)}</td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>

                <g:if test="${servicesDashboard.visible && programDetails.servicesWithScores}">
                    <div>
                        <hr/>
                        <div class="well-title">Dashboard</div>
                        <g:set var="services" value="${programDetails.servicesWithScores}"/>

                        <g:each in="${services}" var="service_detail" >
                            <div class="dashboard-section" style="padding:10px; margin-top:10px;">
                                <h3>${service_detail.name}</h3>
                                <g:each in="${service_detail.scores}" var="score">
                                    <fc:renderScore score="${score}"></fc:renderScore>
                                </g:each>
                            </div>
                        </g:each>
                    </div>
                </g:if>
            </div>
        </g:each>
    </div>
</div>
</g:if>