
<g:if test="${metadata.projects > 1}">
<div class="accordion" id="reports">
    <g:each in="${categories}" var="category" status="i">

        <g:set var="categoryContent" value="category_${i}"/>
        <div class="accordion-group">
            <div class="accordion-heading header">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#reports" href="#${categoryContent}">
                    ${category} <g:if test="${!scores[category]}"><span class="pull-right" style="font-weight:normal">[no data available]</span></g:if>

                </a>
            </div>
            <div id="${categoryContent}" class="outputData accordian-body collapse">
            <div class="accordian-inner row-fluid">
            <g:if test="${scores[category]}">
                <div class="span6" style="min-width: 460px;">

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
                <div class="span6" style="min-width: 460px;">

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
            </g:if>
            <g:else>
                There is no data available for this category.<br/>
            </g:else>
            </div>
            </div>

        </div>
    </g:each>

        <div id="metadata">
            Results include ${metadata.projects} projects, ${metadata.sites} sites and ${metadata.activities} activities

        </div>

</div>

</g:if>
<g:else>
    <div class="alert alert-error">
        Not enough data was returned to display summary data for your facet selection.
    </div>
</g:else>
