<div id="services-dashboard">

    <g:if test="${servicesDashboard.planning}">
        <b>Please note this project is currently in a planning phase so delivery against the targets below has not yet begun</b>
    </g:if>
    <g:each in="${servicesDashboard.services}" var="service" status="i">

        <div class="dashboard-section" style="padding:10px; margin-top:10px;">
            <h3>${service.name}</h3>
            <g:each in="${service.scores}" var="score">
                <fc:renderScore score="${score}"></fc:renderScore>
            </g:each>

        </div>

    </g:each>
</div>
