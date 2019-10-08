<!-- OVERVIEW -->
<div class="row-fluid">
    <div class="clearfix" data-bind="visible:organisationId()||organisationName()">
        <h4>
            Recipient:
            <a data-bind="visible:organisationId(),attr:{href:fcConfig.organisationLinkBaseUrl+'/'+organisationId()}">
                <span data-bind="text:organisationName"></span>
            </a>
            <span data-bind="visible:!organisationId(),text:organisationName"></span>
        </h4>
    </div>
    <div class="clearfix" data-bind="visible:orgIdSvcProvider() || serviceProviderName()">
        <h4>
            Service provider:
            <a data-bind="visible:orgIdSvcProvider(),attr:{href:fcConfig.organisationLinkBaseUrl+'/'+orgIdSvcProvider()}">
                <span data-bind="text:serviceProviderName"></span>
            </a>
            <span data-bind="visible:!orgIdSvcProvider(),text:serviceProviderName"></span>
        </h4>
    </div>
    <div class="clearfix" data-bind="visible:associatedProgram()">
        <h4>
            Programme:
            <span data-bind="text:associatedProgram"></span>
            <span data-bind="text:associatedSubProgram"></span>
        </h4>
    </div>
    <g:if test="${!projectContent.overview.fundingHidden}">
    <div class="clearfix" data-bind="if:funding()">
        <h4>
            Approved funding (GST exclusive): <span data-bind="text:funding.formattedCurrency"></span>
        </h4>

    </div>
    </g:if>

    <g:if test="${!projectContent.overview.datesHidden}">
    <div data-bind="visible:plannedStartDate()">
        <h4>
            Project start: <span data-bind="text:plannedStartDate.formattedDate"></span>
            <span data-bind="visible:plannedEndDate()">Project finish: <span data-bind="text:plannedEndDate.formattedDate"></span></span>
        </h4>
    </div>
    </g:if>

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
            Grant Id:
            <span data-bind="text:grantId"></span>
        </div>
        <div class="span3" data-bind="visible:externalId" style="margin-bottom: 0">
            External Id:
            <span data-bind="text:externalId"></span>
        </div>
        <div class="span3" data-bind="visible:manager" style="margin-bottom: 0">
            Manager:
            <span data-bind="text:manager"></span>
        </div>

    </div>
    <div data-bind="visible:description()">
        <p class="well well-small more" data-bind="text:description"></p>
    </div>
</div>

<g:if test="${displayOutcomes && outcomes}">
    <div id="outcomes">
        <g:if test="${outcomes.environmentalOutcomes}">
            <div class="row-fluid outcome outcome-environmental">
                <h3>Environmental Outcomes</h3>
                <p>${outcomes.environmentalOutcomes}</p>
            </div>
        </g:if>
        <g:if test="${outcomes.economicOutcomes}">
            <div class="row-fluid outcome outcome-economic">
                <h3>Economic Outcomes</h3>
                <p>${outcomes.economicOutcomes}</p>
            </div>
        </g:if>
        <g:if test="${outcomes.socialOutcomes}">
            <div class="row-fluid outcome outcome-social">
                <h3>Social Outcomes</h3>
                <p>${outcomes.socialOutcomes}</p>
            </div>
        </g:if>
    </div>
</g:if>

<g:if test="${displayDashboard}">
    <g:render template="serviceDashboard"/>
</g:if>

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
        <a class="newBlog" href="${g.createLink(controller: 'blog', action: 'create', params:[projectId:project.projectId, returnTo:g.createLink(controller: 'project', action:'index', id:project.projectId)])}">
            <button class="btn"><i class="fa fa-newspaper-o"></i> New Entry</button></a>
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




