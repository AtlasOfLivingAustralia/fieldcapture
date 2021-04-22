<div id="services-dashboard">

    <g:if test="${servicesDashboard.planning}">
        <b>Please note this project is currently in a planning phase so delivery against the targets below has not yet begun</b>
    </g:if>
    <g:each in="${servicesDashboard.services}" var="service" status="i">

        <div class="dashboard-section pb-3 pl-2 pr-2 mt-2">
            <h3 class="serviceTitle">${service.name}</h3>
            <g:each in="${service.scores}" var="score">
                <fc:renderScore score="${score}"></fc:renderScore>
            </g:each>

        </div>

    </g:each>
</div>
