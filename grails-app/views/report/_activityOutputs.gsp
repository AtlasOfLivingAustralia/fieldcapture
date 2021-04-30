<g:if test="${scores[category]}">
    <div class="row">
        <div class="span6 col-sm-6" style="min-width: 460px;">

            <g:each in="${scores[category][0]}" var="categoryScores">

                <g:each in="${categoryScores}" var="outputScores">

                    <div class="well well-small">
                        <h3>${outputScores.key}</h3>
                        <g:each in="${outputScores.value}" var="score">
                            <fc:renderScore score="${score}"></fc:renderScore>
                        </g:each>
                    </div><!-- /.well -->

                </g:each>

            </g:each>
        </div>

        <div class="span6 col-sm-6" style="min-width: 460px;">

            <g:each in="${scores[category][1]}" var="categoryScores">

                <g:each in="${categoryScores}" var="outputScores">

                    <div class="well well-small">
                        <h3>${outputScores.key}</h3>
                        <g:each in="${outputScores.value}" var="score">
                            <fc:renderScore score="${score}"></fc:renderScore>
                        </g:each>
                    </div><!-- /.well -->

                </g:each>

            </g:each>
        </div>
    </div>
</g:if>
<g:else>
    <span>There is no data available for this category.<br/></span>
</g:else>
