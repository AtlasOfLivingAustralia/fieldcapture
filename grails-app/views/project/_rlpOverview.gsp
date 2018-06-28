<!-- OVERVIEW -->
<div class="row-fluid">
    <div class="clearfix" data-bind="visible:associatedProgram()">
        <h4>
            Program:
            <span>Regional Landcare Program</span>
        </h4>
    </div>
    <div class="clearfix">
        <g:if test="${config?.program}">
            <h4>Management Unit:
            <g:link controller="program" action="index" id="${config.program.programId}"> ${config.program.name} </g:link>
            </h4>

        </g:if>
    </div>
    <div class="clearfix" data-bind="visible:organisationId()||organisationName()">
        <h4>
            Service Provider:
            <a data-bind="visible:organisationId(),attr:{href:fcConfig.organisationLinkBaseUrl+'/'+organisationId()}">
                <span data-bind="text:organisationName"></span>
            </a>
            <span data-bind="visible:!organisationId(),text:organisationName"></span>
        </h4>
    </div>

    <div data-bind="visible:plannedStartDate()">
        <h4>
            Project start: <span data-bind="text:plannedStartDate.formattedDate"></span>
            <span data-bind="visible:plannedEndDate()">Project finish: <span data-bind="text:plannedEndDate.formattedDate"></span></span>
        </h4>
    </div>

    <div class="clearfix" style="font-size:14px;">
        <div class="span3" data-bind="visible:status" style="margin-bottom: 0">
            <span data-bind="if: status().toLowerCase() == 'active'">
                Project Status:
                <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-success" style="font-size: 13px;"></span>
            </span>
            <span data-bind="if: status().toLowerCase() == 'completed'">
                Project Status:
                <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-info" style="font-size: 13px;"></span>
            </span>

        </div>
        <div class="span3" data-bind="visible:grantId" style="margin-bottom: 0">
            Project ID:
            <span data-bind="text:grantId"></span>
        </div>
        <div class="span3" data-bind="visible:externalId" style="margin-bottom: 0">
            External Id:
            <span data-bind="text:externalId"></span>
        </div>

    </div>
    <div data-bind="visible:description()">
        <p class="well well-small more" data-bind="text:description"></p>
    </div>
</div>


<g:render template="serviceDashboard"/>


<div class="multimedia" data-bind="if:embeddedVideos">
    <h3>Multimedia</h3>
        <div class="row-fluid" data-bind="repeat:{foreach:embeddedVideos, step:2}" >
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
        <a href="${g.createLink(controller: 'blog', action: 'create', params:[projectId:project.projectId, returnTo:g.createLink(controller: 'project', action:'index', id:project.projectId)])}"><button class="btn"><i class="fa fa-newspaper-o"></i> New Entry</button></a>
        <button id="gotoEditBlog" class="btn"><i class="fa fa-edit"></i> Edit</button>
        </a>
    </g:if>

    <g:if test="${publicImages}">
        <div class="row-fluid">
            <h3>Project photos</h3>
            <g:render template="thumbnails" model="${[publicImages:publicImages]}"/>
        </div>
        <hr/>

    </g:if>


    <g:if test="${hasNewsAndEvents}">
        <h3>News & events</h3>
        <div class="blog-section">
            <g:render template="/shared/blog" model="${[blog:blog, type:'News and Events']}"/>

            %{-- Legacy news & events section--}%
            <div class="row-fluid" data-bind="if:newsAndEvents()">
                <div class="span12" id="newsAndEventsDiv" data-bind="html:newsAndEvents.markdownToHtml()" ></div>
            </div>
        </div>
    </g:if>

    <g:if test="${hasProjectStories}">
    <div class="row-fluid">
        <h3>Project stories</h3>
        <div class="blog-section">
            <g:render template="/shared/blog" model="${[blog:blog, type:'Project Stories']}"/>

            %{-- Legacy news & events section--}%
            <div class="row-fluid" data-bind="visible:projectStories()">
                <div class="span12" id="projectStoriesDiv" data-bind="html:projectStories.markdownToHtml()"></div>
            </div>
        </div>
    </div>
    </g:if>
</g:if>




