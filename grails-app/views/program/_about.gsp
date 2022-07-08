<div id="carousel" class="slider-pro row" data-bind="visible:mainImageUrl()" style="margin-bottom:20px;">
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
    <div class="col-md-4" >
        <h3>Description</h3>
        <span data-bind="html:description.markdownToHtml()"></span>
    </div>
    <div class="col-md-8">
        <m:map id="muMap" width="100%" height="500px"></m:map>
    </div>

    <div class="col-md-12" id="state-mu">
        <div class="well">Click on a heading or <a id="showAllStatesMu" href="#">Show all</a>  | <a id="hideAllStatesMu"  href="#">Hide all</a> management units</div>
        <div class="panel panel-default">
            <g:set var="states" value="${['Australia Capital Territory','New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia']}"></g:set>
            <g:set var="statesAcronyms" value="${['ACT','NSW', 'NT', 'Queensland', 'SA', 'Tasmania', 'Victoria', 'WA']}"></g:set>
            <g:each in="${states}" status="i" var="state" >
                <div class="card">
                    <div class="card-header">
                        <a class="state-mu-toggle collapsed" data-toggle="collapse" data-parent="#state-mu" href="#state-mu-${i}">
                            ${state}
                        </a>
                    </div>
                    <div id="state-mu-${i}" class="collapse col-md-offset-1 col-md-11 card-body">
                        <g:findAll in="${program.managementUnits}" expr="it.state?.startsWith(state) || it.state?.startsWith(statesAcronyms[i])">
                            <li><a href="${g.createLink(controller: 'managementUnit', action: 'index',id:it.managementUnitId)}">${it.name}</a></li>
                        </g:findAll>
                    </div>
                </div>
            </g:each>
        </div>
    </div>
</div>

<g:if test="${program.subPrograms}">
    <div class="projects-wrapper d-none d-md-block" id="subProgramWrapper">
        <hr/>
        <div class="well-title">Sub Programs</div>
        <ul class="nav nav-tabs" id="programs-tabs">
            <g:each var="displayProgram" in="${program.subPrograms}" status="i">
                <li class="nav-item">
                    <g:set var="active" value="${i==0?'active':''}"/>
                    <a class="nav-link ${active}"  id="subProgramTitleTab" data-toggle="tab" href="#${displayProgram.programId}_subPrograms" role="tab">${displayProgram.name}</a>
                </li>
            </g:each>
        </ul>
        <div class="tab-content" id="programs-TabContent">
            <g:each var="subDescriptions" in="${program.subPrograms}" status="i">
                <g:set var="active" value="${i==0?'active':''}"/>
                <div class="tab-pane ${active}" id="${subDescriptions.programId}_subPrograms">
                    <div class="well">
                        <div><p><strong>Name:</strong> <a id="subProgramName" href="${g.createLink(controller:'program', action:'index', id:subDescriptions.programId)}" >${subDescriptions.name}</a></p></div>
                        <br/>
                        <div>
                            <strong>Description: </strong><p id="subProgramDescription">${subDescriptions.description}</p>
                        </div>
                    </div>
                </div>
            </g:each>

        </div>

    </div>

</g:if>


<g:if test="${program.outcomes}">
    <div class="well">
        <div class="well-title">The following outcomes are being addressed by this program</div>
        <div class="row outcomes no-gutters">
            <g:each in="${program.outcomes}" var="outcome" >
                <g:set var="outcomeClass" value="${outcome.targeted ? 'targeted' : 'disabled'}"/>
                <div class="col-md">
                    <div class="outcome-wrapper h-100">
                        <div class="h-100 outcome ${outcomeClass}" <g:if test="${!outcome.targeted}">aria-hidden="true"</g:if>>
                            ${outcome.shortDescription}
                        </div>
                    </div>
                </div>
            </g:each>
        </div>
    </div>
</g:if>




<div class="projects-wrapper d-none d-md-block">
<g:set var="projects" value="${content.projects.projects}" />
<g:if test="${projects}">
    <div class="well-title">Projects</div>
    <table id="projectOverviewList" class="table table-striped table-bordered">
        <thead class="thead-light">
        <th class="grantId"><g:message code="label.merit.projectID"/></th>
        <th class="name">Name</th>
        <th class="description">Description</th>
        <th class="outcomes">Outcome</th>
        <th class="priority">Investment Priority</th>
        <th class="startDate">Start Date</th>
        <th class="endDate">End Date</th>
        </thead>
        <tbody>
        <g:each var="project" in="${projects}">
            <tr>
                <td class="grantId"><a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}" >${project.grantId}</a></td>
                <td class="projectName">${project.name}</td>
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
        </g:each>
        </tbody>
    </table>
</g:if>
<g:else>
    <div class="row">
        <span class="col-sm"><h4>${program.name?.encodeAsHTML()} is not currently running any projects.</h4></span>
    </div>
</g:else>

</div>
<hr/>
<g:if test="${blog.editable || blog.hasNewsAndEvents || blog.hasProgramStories || blog.hasPhotos}">
<div class="row">
    <div class="well-title ml-2 col-sm-11">Program blog</div>
    <g:if test="${blog.editable}">
        <div class="col-sm-11 ml-2">
            <p>
                <a class="newBlog" href="${g.createLink(controller: 'blog', action: 'create', params:[programId: program.programId, returnTo:g.createLink(controller: 'program', action:'index', id:program.programId)])}">
                <button class="btn"><i class="fa fa-newspaper-o"></i> New Entry</button></a>
                <button id="gotoEditBlog" class="btn"><i class="fa fa-edit"></i> Edit</button>
                </a>
            </p>
        </div>
    </g:if>


    <g:if test="${blog.hasNewsAndEvents}">
        <div class="well-title ml-2 col-sm-11">News and Events</div>
        <div class="blog-section  ml-2 col-sm-11">
            <g:render template="/shared/blog" model="${[blog:blog.blogs, type:'News and Events']}"/>
        </div>
    </g:if>

    <g:if test="${blog.hasProgramStories}">
            <div class="well-title ml-2 col-sm-11">Program stories</div>
            <div class="blog-section ml-2 col-sm-11">
                <g:render template="/shared/blog" model="${[blog:blog.blogs, type:'Program Stories']}"/>
            </div>
    </g:if>

    <g:if test="${blog.hasPhotos}">
            <div class="well-title ml-2 col-sm-11">Photos</div>
            <div class="blog-section ml-2 col-sm-11">
                <g:render template="/shared/blog" model="${[blog:blog.blogs, type:'Photo']}"/>
            </div>
    </g:if>

 </div>
</g:if>

<g:if test="${servicesDashboard.visible && servicesDashboard.services}">
    <hr/>
    <div class="well-title">Dashboard</div>
    <div id="services-dashboard">

        <g:if test="${servicesDashboard.planning}">
            <b>Please note this program is currently in a planning phase so delivery against the targets below has not yet begun</b>
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

