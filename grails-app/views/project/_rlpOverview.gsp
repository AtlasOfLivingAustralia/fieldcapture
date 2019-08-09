<!-- OVERVIEW -->
<div class="overview">

    <div class="row-fluid">
        <div class="span6">
            <div class="row-fluid">

                <div class="span12">

                    <g:if test="${config.program.parent}">
                        <div class="row-fluid">
                            <div class="span4 header-label">Program</div>

                            <div class="span8">${config.program.parent.name}</div>
                        </div>
                    </g:if>
                    <div class="row-fluid">
                        <div class="span4 header-label">Management Unit</div>

                        <div class="span8"><g:link controller="program" action="index"
                                                   id="${config.program.programId}">${config.program.name}</g:link></div>
                    </div>

                    <div class="row-fluid">
                        <div class="span4 header-label">Service Provider</div>

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
                            <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-info"
                                  style="font-size: 13px;"></span>
                        </div>
                    </div>

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

                    <div class="row-fluid" data-bind="visible:workOrderId">
                        <div class="span4 header-label">Internal order number</div>

                        <div class="span8">${project.workOrderId}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="row-fluid">
        <div class="span2 header-label">RLP outcomes addressed</div>

        <div class="span9 value">
            <table class="table table-bordered ">
                <g:if test="${project.custom?.details?.outcomes?.primaryOutcome}">
                    <g:set var="p_outcome" value="${project.custom?.details?.outcomes?.primaryOutcome}"></g:set>
                    <tr>
                        <td>Primary Outcome</td>
                        <td>${p_outcome.shortDescription}</td>
                        <td>
                            <g:each in="${p_outcome.assets}" var="p_asset">
                                <li>${p_asset}</li>
                            </g:each>
                        </td>
                    </tr>
                </g:if>
                <g:if test="${project.custom?.details?.outcomes?.secondaryOutcomes}">
                    <g:set var="s_outcomes" value="${project.custom?.details?.outcomes?.secondaryOutcomes}"></g:set>
                    <g:each status="i" in="${s_outcomes}" var="s_outcome">
                        <tr>
                            <g:if test="${i == 0}">
                                <td rowspan="${s_outcomes.size()}">Secondary Outcomes</td>
                            </g:if>
                            <td>${s_outcome.shortDescription}</td>
                            <td>
                                <g:each in="${s_outcome.assets}" var="s_asset">
                                    <li>${s_asset}</li>
                                </g:each>
                            </td>
                        </tr>
                    </g:each>
                </g:if>
            </table>

        </div>
    </div>

    <div class="row-fluid">
        <div class="span2 header-label">Project description</div>

        <div class="span9 value">
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
        <a href="${g.createLink(controller: 'blog', action: 'create', params: [projectId: project.projectId, returnTo: g.createLink(controller: 'project', action: 'index', id: project.projectId)])}"><button
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




