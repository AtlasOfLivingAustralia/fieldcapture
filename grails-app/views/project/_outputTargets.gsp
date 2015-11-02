<div class="row-fluid">
    <div class="span4">
        <g:set var="count" value="${targets.size()}"/>
        <g:each in="${targets?.entrySet()}" var="metric" status="i">
        %{--This is to stack the output metrics in three columns, the ceil biases uneven amounts to the left--}%
            <g:if test="${i == Math.ceil(count / 3) || i == Math.ceil(count / 3 * 2)}">
                </div>
                <div class="span4">
            </g:if>
            <div class="well">
                <h3>${metric.key}</h3>
                <g:each in="${metric.value}" var="score">
                    <fc:renderScore score="${score}"></fc:renderScore>
                </g:each>
            </div>
        </g:each>
    </div>
</div>
