<!-- OVERVIEW -->
<div class="overview">

    <div class="row-fluid">
        <div class="span6">
            <div class="row-fluid">

                <div class="span12">
                    <div class="row-fluid">
                        <div class="span4 header-label">Program</div>

%{--                        This is temporarily not public until #1829 is released.--}%
                        <g:if test="${fc.userIsAlaAdmin()}">
                            <div class="span8 programName"><g:link controller="program" action="index"
                                         id="${config.program.programId}"><fc:programFullName program="${config.program}"/></g:link></div>
                        </g:if>
                        <g:else>
                            <div class="span8 programName"><fc:programFullName program="${config.program}"/></div>
                        </g:else>

                    </div>
                    <g:if test="${project.managementUnitId}">
                    <div class="row-fluid">
                        <div class="span4 header-label">Management Unit</div>
                        <div class="span8 managementUnitName"><g:link controller="managementUnit" action="index"
                                                   id="${project.managementUnitId}">${project.managementUnitName?.encodeAsHTML()}</g:link></div>
                    </div>
                    </g:if>

                    <div class="row-fluid">
                        <div class="span4 header-label">${config.program?.config?.organisationRelationship ?: "Service Provider"}</div>

                        <div class="span8">
                            <a data-bind="visible:organisationId(),attr:{href:fcConfig.organisationLinkBaseUrl+'/'+organisationId()}">
                                <span data-bind="text:organisationName"></span>
                            </a>
                            <span data-bind="visible:!organisationId(),text:organisationName"></span>
                        </div>
                    </div>

                    <div class="row-fluid">
                        <div class="span4 header-label">Project ID</div>

                        <div class="span8">${project.grantId}</div>
                    </div>

                    <div class="row-fluid">
                        <div class="span4 header-label">Project status</div>

                        <div class="span8 value">
                            <span data-bind="if: status().toLowerCase() == 'terminated'">
                                <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-danger projectStatus"></span>
                            </span>
                            <span data-bind="if: status().toLowerCase() != 'terminated'">
                                <span  data-bind="text:status" class="badge badge-info projectStatus"></span>
                            </span>
                        </div>
                    </div>
                    <g:if test="${fc.userIsAlaOrFcAdmin()}">
                        <span data-bind="if: status().toLowerCase() == 'terminated'">
                            <div class="row-fluid">
                                <div class="span4 header-label">Termination Reason</div>
                                <div class="span8 value">
                                    <span class="terminationReason" data-bind="text: terminationReason"></span>
                                </div>
                            </div>
                        </span>
                    </g:if>

                </div>
            </div></div>

        <div class="span6">
            <div class="row-fluid">
                <div class="span12">

                    <div class="row-fluid">
                        <div class="span4 header-label">Project start</div>

                        <div class="span8 value"><span data-bind="text:plannedStartDate.formattedDate"></span></div>
                    </div>

                    <div class="row-fluid">
                        <div class="span4 header-label">Project end</div>

                        <div class="span8 value"><span data-bind="text:plannedEndDate.formattedDate"></span></div>
                    </div>


                    <div class="row-fluid" data-bind="if:(funding() && funding() >0)">
                        <div class="span4 header-label">Project Funding</div>

                        <div class="span8 value"><span data-bind="text:funding.formattedCurrency"></span></div>
                    </div>

                    <g:if test="${showOrderNumber}">
                    <div class="row-fluid" data-bind="visible:internalOrderId">
                        <div class="span4 header-label">Internal order number</div>

                        <div class="span8">${project.internalOrderId}</div>
                    </div>
                    </g:if>
                </div>
            </div>
        </div>
    </div>

    <g:if test="${outcomes}">
    <h4>Program outcomes addressed</h4>

    <div class="row-fluid">
        <div class="span12 value">
            <g:if test="${project.custom?.details?.outcomes?.primaryOutcome?.description}">
                <table class="table project-outcomes">
                    <g:set var="p_outcome" value="${project.custom?.details?.outcomes?.primaryOutcome}"></g:set>
                    <thead>
                    <tr>
                        <th></th>
                        <th class="outcome">Outcomes</th>
                        <th class="priority">Primary Investment Priority</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="header-column">Primary Outcome</td>
                        <td class="outcome">${p_outcome.description}</td>
                        <td class="priority">
                            <g:if test="${p_outcome.assets?.size() > 1}">
                                <ul>
                                    <g:each in="${p_outcome.assets}" var="p_asset">
                                        <li>${p_asset}</li>
                                    </g:each>
                                </ul>
                            </g:if>
                            <g:else>
                                <g:each in="${p_outcome.assets}" var="p_asset">
                                    ${p_asset}
                                </g:each>
                            </g:else>
                        </td>
                    </tr>

                    <g:if test="${project.custom?.details?.outcomes?.secondaryOutcomes?.find{it.description}}">
                        <g:set var="s_outcomes" value="${project.custom?.details?.outcomes?.secondaryOutcomes}"></g:set>
                        <g:each status="i" in="${s_outcomes}" var="s_outcome">
                            <tr>
                                <g:if test="${i == 0}">
                                    <td rowspan="${s_outcomes.size()}" class="header-column">Secondary Outcomes</td>
                                </g:if>
                                <td class="outcome">${s_outcome.description}</td>
                                <td class="priority">
                                    <g:each in="${s_outcome.assets}" var="s_asset">
                                        ${s_asset}<br/>
                                    </g:each>
                                </td>
                            </tr>
                        </g:each>
                    </g:if>
                    </tbody>
                </table>
            </g:if>
            <g:else>
                The MERI Plan is currently being developed. These details will be made available as soon as possible.
            </g:else>
        </div>
    </div>
    </g:if>

    <g:if test="${objectives}">
        <h4>Objectives addressed</h4>
        <g:if test="${project.custom?.details?.objectives?.rows1 && project.custom?.details?.objectives?.rows1[0]?.description}">
            <ul>
            <g:each in="${project.custom.details.objectives.rows1}" var="objective">
                <li>${objective.description}</li>
            </g:each>
            </ul>
        </g:if>
        <g:else>
            The MERI Plan is currently being developed. These details will be made available as soon as possible.
        </g:else>
    </g:if>

    <h4>Project Description</h4>
    <div class="row-fluid">
        <div class="span12 value">
            <p class="well well-small more" data-bind="text:description"></p>
        </div>
    </div>

</div>
<hr/>

<div class="multimedia" data-bind="if:embeddedVideos">
    <h3>Multimedia</h3>

    <div class="row-fluid" data-bind="repeat:{foreach:embeddedVideos, step:2}">
        <!-- ko if:embeddedVideos()[$index] -->
        <span class="span6" data-bind="html: embeddedVideos()[$index].iframe"></span>
        <!-- /ko -->
        <!-- ko if:embeddedVideos()[$index+1] -->
        <span class="span6" data-bind="html: embeddedVideos()[$index+1].iframe"></span>
        <!-- /ko -->
    </div>
</div>


<g:if test="${user?.isEditor || publicImages || hasNewsAndEvents || hasProjectStories}">
    <hr/>

    <h2>Project blog</h2>
    <g:if test="${user?.isEditor}">
        <a class="newBlog" href="${g.createLink(controller: 'blog', action: 'create', params: [projectId: project.projectId, returnTo: g.createLink(controller: 'project', action: 'index', id: project.projectId)])}"><button
                class="btn"><i class="fa fa-newspaper-o"></i> New Entry</button></a>
        <button id="gotoEditBlog" class="btn"><i class="fa fa-edit"></i> Edit</button>
        </a>
    </g:if>

    <g:if test="${publicImages}">
        <div class="row-fluid">
            <h3>Project photos</h3>
            <g:render template="thumbnails" model="${[publicImages: publicImages]}"/>
        </div>
        <hr/>

    </g:if>


    <g:if test="${hasNewsAndEvents}">
        <h3>News & events</h3>

        <div class="blog-section">
            <g:render template="/shared/blog" model="${[blog: blog, type: 'News and Events']}"/>

            %{-- Legacy news & events section--}%
            <div class="row-fluid" data-bind="if:newsAndEvents()">
                <div class="span12" id="newsAndEventsDiv" data-bind="html:newsAndEvents.markdownToHtml()"></div>
            </div>
        </div>
    </g:if>

    <g:if test="${hasProjectStories}">
        <div class="row-fluid">
            <h3>Project stories</h3>

            <div class="blog-section">
                <g:render template="/shared/blog" model="${[blog: blog, type: 'Project Stories']}"/>

                %{-- Legacy news & events section--}%
                <div class="row-fluid" data-bind="visible:projectStories()">
                    <div class="span12" id="projectStoriesDiv" data-bind="html:projectStories.markdownToHtml()"></div>
                </div>
            </div>
        </div>
    </g:if>
</g:if>




