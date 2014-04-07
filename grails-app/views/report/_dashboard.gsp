
<g:if test="${metadata.projects > 1}">
<div class="accordion" id="reports">
    <g:each in="${categories}" var="category" status="i">

        <g:set var="categoryContent" value="category_${i}"/>
        <div class="accordion-group">
            <div class="accordion-heading header">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#reports" href="#${categoryContent}">
                    ${category} <g:if test="${!scores[category]}"><span style="font-weight:normal">[no data available]</span></g:if>
                </a>
            </div>
            <div id="${categoryContent}" class="outputData accordian-body collapse">
            <div class="accordian-inner">
            <g:if test="${scores[category]}">

            <g:each in="${scores[category]}" var="categoryScores">

                    <g:each in="${categoryScores}" var="outputScores">

                        <div class="dontsplit">
                            <div class="well well-small">
                                <h3>${outputScores.key}</h3>
                                <g:each in="${outputScores.value}" var="score">
                                    <fc:renderScore score="${score}"></fc:renderScore>
                                </g:each>
                            </div><!-- /.well -->
                        </div><!-- /.span6 -->

                    </g:each>

            </g:each>
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

<script>

    $('#reports').on('shown', function (e) {
        var content = $(e.target);
        var columnized = content.find('.column').length > 0;
        if (!columnized){
        //    content.columnize({ columns: 2, lastNeverTallest:true, accuracy: 10 });
        }

    })
</script>
</g:if>
<g:else>
    <div class="alert alert-error">
        Not enough data was returned to display summary data for your facet selection.
    </div>
</g:else>
