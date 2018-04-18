<div id="services-dashboard">

    <g:each in="${services}" var="service" status="i">

        <div class="statistics stat-1">
            <h3>${service.name}</h3>
            <g:each in="${service.scores}" var="score">
                <fc:renderScore score="${score}"></fc:renderScore>
            </g:each>

        </div>

    </g:each>
</div>
