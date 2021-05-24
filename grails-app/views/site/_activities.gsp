
<h2 style="display:inline-block;">Activities at this site</h2>

<g:if test="${activities}">
    <div class="row-fluid">
        <!-- ACTIVITIES -->
        <div class="tab-pane active" id="activity">
            <g:render template="/shared/activitiesListReadOnly"
                      model="[activities:activities ?: [], sites:[], showSites:false]"/>
        </div>
    </div>
</g:if>
<g:else>
     <div>No activities at this site.</div>
</g:else>