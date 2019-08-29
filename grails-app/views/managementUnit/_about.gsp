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

<div class="row">
    <div class="col-md-12 ">
        <div class="well-title ">Description</div>
    </div>
    <div class="col-md-8" >
        <span data-bind="html:description.markdownToHtml()"></span>
    </div>
    <div data-bind="visible:managementUnitSiteId" class="col-md-4">
        <m:map id="managementUnitSiteMap" width="100%" height="300px"></m:map>
    </div>
</div>


<g:if test="${mu.outcomes}">
    <div class="well">
        <div class="well-title">The Service Provider is addressing these RLP outcomes</div>
        <div class="row outcomes no-gutters">
            <g:each in="${mu.outcomes}" var="outcome" >
                <g:set var="outcomeClass" value="${outcome.targeted ? 'targeted' :''}"/>
                <div class="col-md">
                    <div class="outcome-wrapper h-100">
                        <div class="h-100 outcome ${outcomeClass}">
                            ${outcome.shortDescription}
                            <g:if test ="${outcome.targeted}"><span class="fa fa-check-circle"></span></g:if>
                        </div>
                    </div>
                </div>
            </g:each>
        </div>
    </div>
</g:if>


<div class="projects-wrapper d-none d-md-block">
    <g:set var="projects" value="${mu.projects}" />
    <g:set var="programs" value="${mu.programs}" />

    <g:if test="${programs}">
        <g:each var="program" status="i" in="${programs}">
            <div class="well-title">${program} </div>
            <table id="projectOverviewList-${i}" class="table table-striped table-bordered">
                <thead class="thead-light">
                <th class="projectId">Project ID</th>
                <th class="name">Name</th>
                <th class="description">Description</th>
                <th class="outcomes">Outcome</th>
                <th class="priority">Investment Priority</th>
                <th class="startDate">Start Date</th>
                <th class="endDate">End Date</th>
                </thead>
                <tbody>
                <g:each var="project" in="${projects}">
                    <g:if test="${project.programId == program}">
                        <tr>
                            <td class="projectId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.externalId ?: project.grantId}</a></td>
                            <td class="name">${project.name}</td>
                            <td class="description">${project.description}</td>
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
                    </g:if>
                </g:each>
                </tbody>
            </table>
        </g:each>
    </g:if>

<g:if test="${blog.editable || blog.hasNewsAndEvents || blog.hasProgramStories || blog.hasPhotos}">
    <div class="row-fluid">
        <hr/>
        <div class="well-title">Management Unit Blogs</div>
        <g:if test="${blog.editable}">
            <p>
                <a href="${g.createLink(controller: 'blog', action: 'create', params:[managementUnitId: mu.managementUnitId, returnTo:g.createLink(controller: 'managementUnit', action:'index', id:mu.managementUnitId)])}"><button class="btn"><i class="fa fa-newspaper-o"></i> New Entry</button></a>
            <button id="gotoEditBlog" class="btn"><i class="fa fa-edit"></i> Edit</button>
            </a>
        </p>
        </g:if>


        <g:if test="${blog.hasNewsAndEvents}">
            <div class="row-fluid">
                <div class="well-title">News and Events</div>
                <div class="blog-section">
                    <g:render template="/shared/blog" model="${[blog:blog.blogs, type:'News and Events']}"/>
                </div>
            </div>
        </g:if>

        <g:if test="${blog.hasManagementUnitStories}">
            <div class="row-fluid">
                <div class="well-title">Program stories</div>
                <div class="blog-section">
                    <g:render template="/shared/blog" model="${[blog:blog.blogs, type:'Management Unit Stories']}"/>
                </div>
            </div>
        </g:if>

        <g:if test="${blog.hasPhotos}">
            <div class="row-fluid">
                <div class="well-title">Photos</div>
                <div class="blog-section">
                    <g:render template="/shared/blog" model="${[blog:blog.blogs, type:'Photo']}"/>
                </div>
            </div>
        </g:if>

    </div>
</g:if>



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

