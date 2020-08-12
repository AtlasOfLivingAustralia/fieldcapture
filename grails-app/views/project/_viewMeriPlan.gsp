<g:if test="${meriPlanVisibleToUser}">
    <!-- Project Details -->
    <!-- ko stopBinding:true -->
    <div id="view-meri-plan">
        <div>
            <span class="badge" style="font-size: 13px;" data-bind="text:meriPlanStatus().text, css:meriPlanStatus().badgeClass"></span>
            <span data-bind="if:detailsLastUpdated"> <br/>Last update date : <span data-bind="text:detailsLastUpdated.formattedDate"></span></span>
        </div>
    <g:render template="${meriPlanTemplate}" model="[project: project, risksAndThreatsVisible:risksAndThreatsVisible, announcementsVisible:announcementsVisible]"/>
    </div>
    <!-- /ko -->

    <div class="row-fluid space-after">
        <div class="span12">
            <div class="well well-small">
                <label><b>MERI attachments:</b></label>
                <g:render template="/shared/listDocuments"
                          model="[useExistingModel: true,editable:false, filterBy: 'programmeLogic', ignore: [], imageUrl:assetPath(src:'/'),containerId:'meriPlanDocumentList']"/>
            </div>
        </div>
    </div>
</g:if>
<g:else>
    <!-- ko stopBinding:true -->
    <div id="view-meri-plan">
    <h3>MERI plan in development</h3>
    </div>
    <!-- /ko -->
</g:else>