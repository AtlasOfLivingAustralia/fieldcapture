
<h2 style="display:inline-block;">Activities at this site</h2>
<g:if test="${project}">
    <button type="button" class="btn btn-link btn-info pull-right" data-bind="click:newActivity" style="vertical-align: baseline; margin-top:20px;"><i class="fa fa-plus"></i> Add new activity</button>

</g:if>
<g:if test="${activities}">
    <div class="row-fluid">
        <!-- ACTIVITIES -->
        <div class="tab-pane active" id="activity">
            <g:render template="/shared/activitiesListReadOnly" plugin="fieldcapture-plugin"
                      model="[activities:activities ?: [], sites:[], showSites:false]"/>
        </div>
    </div>
</g:if>
<g:else>
     <div>No activities at this site.</div>
</g:else>