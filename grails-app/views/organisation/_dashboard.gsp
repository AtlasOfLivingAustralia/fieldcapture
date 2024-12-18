<g:if test="${dashboardData}">
<div class="dashboard-section" style="padding:10px; margin-top:10px;">
    <h3 class="serviceTitle">Indigenous workforce and procurement</h3>
    <g:each in="${dashboardData}" var="score">
        <fc:renderScore score="${score}" includeInvoiced="false"></fc:renderScore>
    </g:each>
</div>
</g:if>

<g:render template="/shared/dashboard"></g:render>