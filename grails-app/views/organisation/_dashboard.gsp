<g:if test="${dashboardData}">
<div class="dashboard-section" style="padding:10px; margin-top:10px;">
    <g:each in="${dashboardData.groupBy{it.category}}" var="category">
        <h3 class="serviceTitle">${category.key}</h3>
        <g:each in="${category.value}" var="score">
            <fc:renderScore score="${score}" includeInvoiced="false"></fc:renderScore>
        </g:each>
    </g:each>
</div>
</g:if>

<g:render template="/shared/dashboard"></g:render>