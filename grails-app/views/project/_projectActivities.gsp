<g:render template="/shared/activitiesPlan"
          model="[activities:project.activities ?: [], sites:project.sites ?: [], showSites:true, reports:reports, scores:scores]"/>
<g:if test="${grantManagerSettingsVisible}">
    <div class="validationEngineContainer" id="grantmanager-validation">
        <g:render template="grantManagerSettings" model="[project:project]"/>
    </div>
</g:if>
<g:if test="${risksAndThreatsVisible}">
    <div class="validationEngineContainer" id="risk-validation" data-bind="with:meriPlan">
        <g:render template="riskTable" model="[project:project]"/>
    </div>
</g:if>