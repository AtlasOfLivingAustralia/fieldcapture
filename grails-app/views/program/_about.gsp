<div id="carousel" class="slider-pro row-fluid" data-bind="visible:mainImageUrl()" style="margin-bottom:20px;">
    <div class="sp-slides">
        <div class="sp-slide">
            <img class="sp-image" data-bind="attr:{'data-src':mainImageUrl}"/>
            <p class="sp-layer sp-white sp-padding"
               data-position="topLeft" data-width="100%" data-bind="visible:url"
               data-show-transition="down" data-show-delay="0" data-hide-transition="up">
                <strong data-bind="visible:url()">Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong>
            </p>
        </div>
    </div>
</div>

<div id="weburl" data-bind="visible:!mainImageUrl() && url()">
    <div data-bind="visible:url()"><strong>Visit us at <a data-bind="attr:{href:url}"><span data-bind="text:url"></span></a></strong></div>
</div>

<div data-bind="visible:description">
    <div class="well">
        <div class="well-title">Description</div>

        <span data-bind="html:description.markdownToHtml()"></span>
    </div>
</div>


<div class="row-fluid">
    <div class="well">
        <div class="well-title">The Service Provider is addressing these RLP outcomes</div>
        <table class="table table-bordered ">
            <thead>
            <tr>
                <g:each in="${program.outcomes}" var="outcome" >
                    <td>
                        ${outcome.shortDescription}
                        <g:if test ="${outcome.targeted}"><span class="fa fa-check-circle"></span></g:if>
                    </td>
                </g:each>
            </tr>
            </thead>
        </table>
    </div>
</div>

<g:set var="projects" value="${content.projects.projects}" />
<g:if test="${projects}">
    <h3>Project reporting</h3>
    <table id="projectOverviewList" class="table table-striped table-bordered">
        <thead class="thead-light">
        <th class="projectId">Project ID</th>
        <th class="name">Name</th>
        <th class="description">Description</th>
        <th class="outcomes">Outcome/s</th>
        <th class="priority">Priority Inv</th>
        <th class="startDate">Start Date</th>
        <th class="endDate">End Date</th>
        </thead>
        <tbody>
        <g:each var="project" in="${projects}">
            <tr>
                <td class="projectId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.externalId ?: project.grantId}</a></td>
                <td class="name">${project.name}</td>
                <td class="description">${project.description}</td>
                <g:set var="primaryOutcome" value="${project.custom.details.outcomes.primaryOutcome}" />
                <td class="outcomes">${primaryOutcome.shortDescription}</td>
                <g:set var="primaryOutcomePriorities" value="${primaryOutcome.assets}"></g:set>
                <td class="priority">
                     <g:each var="priority" in="${primaryOutcomePriorities}">
                         ${priority}
                     </g:each>
                </td>

                <td class="startDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedStartDate)}</td>
                <td class="endDate">${au.org.ala.merit.DateUtils.isoToDisplayFormat(project.plannedEndDate)}</td>

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




<g:if test="${servicesDashboard.visible && servicesDashboard.services}">
    <hr/>
    <div class="well-title">Service delivery</div>
    <div id="services-dashboard">

        <g:if test="${servicesDashboard.planning}">
            <b>Please note this project is currently in a planning phase so delivery against the targets below has not yet begun</b>
        </g:if>
        <g:each in="${servicesDashboard.services}" var="service" status="i">

            <div class="dashboard-section" style="padding:10px; margin-top:10px;">
                <h3>${service.name}</h3>
                <g:each in="${service.scores}" var="score">
                    <fc:renderScore score="${score}"></fc:renderScore>
                </g:each>

            </div>

        </g:each>
    </div>
</g:if>
