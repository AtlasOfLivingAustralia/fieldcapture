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
    <div class="clearfix" data-bind="visible:serviceProviderName()">
        <h4>
            Service provider:
            <span data-bind="text:serviceProviderName"></span>
        </h4>
    </div>
    <div class="clearfix" data-bind="visible:associatedProgram()">
        <h4>
            Programme:
            <span data-bind="text:associatedProgram"></span>
            <span data-bind="text:associatedSubProgram"></span>
        </h4>
    </div>
    <div class="clearfix" data-bind="visible:funding()">
        <h4>
            Approved funding (GST inclusive): <span data-bind="text:funding.formattedCurrency"></span>
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

<g:if test="${metrics.targets}">
    <g:render template="outputTargets" model="${[targets:metrics.targets]}"/>
</g:if>

<g:if test="${outcomes}">
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

<div class="multimedia" data-bind="if:embeddedVideos">
    <h3>Multimedia</h3>
    <!-- ko foreach: embeddedVideos -->

        <div class="row-fluid" data-bind="if:$index() % 2 == 0" >
            <span class="span6" data-bind="html: iframe"></span>
        </div>
        <!-- ko if:$index() % 2 == 1 -->
            <span class="span6" data-bind="html: iframe"></span>
        <!-- /ko -->

    <!-- /ko -->

</div>

<g:if test="${publicImages}">
<div class="row-fluid">
    <h3>Project photos</h3>
    <g:render template="thumbnails" model="${[publicImages:publicImages]}"/>
</div>
</g:if>

<hr/>

<div class="row-fluid" id="project-blog">
    <h2>Project blog</h2>

    <h3>News & events</h3>
    <g:render template="/shared/blog" model="${[blog:blog, type:'News and events']}"/>

    %{-- Legacy news & events section--}%
    <div class="row-fluid" data-bind="if:newsAndEvents()">
        <div class="span12" id="newsAndEventsDiv" data-bind="html:newsAndEvents.markdownToHtml()" ></div>
    </div>

<hr/>


<div class="row-fluid">
    <h3>Project stories</h3>
    <g:render template="/shared/blog" model="${[blog:blog, type:'Project stories']}"/>

    %{-- Legacy news & events section--}%
    <div class="row-fluid" data-bind="visible:projectStories()">
        <div class="span12" id="projectStoriesDiv" data-bind="html:projectStories.markdownToHtml()"></div>
    </div>

</div>

</div>




