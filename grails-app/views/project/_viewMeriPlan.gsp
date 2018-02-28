<g:if test="${meriPlanVisibleToUser}">
    <!-- Project Details -->
    <g:render template="projectDetails" model="[project: project, risksAndThreatsVisible:risksAndThreatsVisible, announcementsVisible:announcementsVisible]"/>

    <div class="row-fluid space-after">
        <div class="span12">
            <div class="well well-small">
                <label><b>MERI attachments:</b></label>
                <g:render template="/shared/listDocuments"
                          model="[useExistingModel: true,editable:false, filterBy: 'programmeLogic', ignore: '', imageUrl:assetPath(src:'/'),containerId:'meriPlanDocumentList']"/>
            </div>
        </div>
    </div>
</g:if>
<g:else>
    <h3>MERI plan in development</h3>
</g:else>