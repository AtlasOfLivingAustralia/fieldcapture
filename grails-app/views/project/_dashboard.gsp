<gvisualization:apiImport/>


<g:set var="targets" value="${metrics.targets}"/>
<g:set var="other" value="${metrics.other}"/>
<g:if test="${targets || other}">

    <g:if test="${targets}">
    <h3 style="margin-top:0;">Output Targets</h3>
    <div class="row-fluid">
        <div class="span4">
            <g:set var="count" value="${targets.size()}"/>

            <g:each in="${targets?.entrySet()}" var="metric" status="i">

            %{--This is to stack the output metrics in three columns, the ceil biases uneven amounts to the left--}%
                <g:if test="${i == Math.ceil(count/3) || i == Math.ceil(count/3*2)}">
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
    </g:if>

    %{--Commenting this out until the formatting is fixed.--}%
    %{--<g:if test="${other}">--}%
        %{--<h3>Outputs without targets</h3>--}%
        %{--<div class="row-fluid">--}%

        %{--<div class="span6">--}%
            %{--<g:each in="${other?.entrySet()}" var="metric" status="i">--}%

                %{--<g:if test="${i%2 == 1}">--}%
                    %{--</div>--}%
                    %{--<div class="span6">--}%
                %{--</g:if>--}%
                %{--<div class="well">--}%
                    %{--<h3>${metric.key}</h3>--}%
                    %{--<g:each in="${metric.value}" var="score">--}%
                        %{--<fc:renderScore score="${score}"></fc:renderScore>--}%
                    %{--</g:each>--}%
                %{--</div>--}%
            %{--</g:each>--}%
        %{--</div>--}%
        %{--</div>--}%


    %{--</g:if>--}%
</g:if>
<g:else>
    <p>No activities or output targets have been defined for this project.</p>
</g:else>
