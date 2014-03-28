%{-- Not using this tag as we want  a protocol-less import<gvisualization:apiImport/>--}%

<style type="text/css">

</style>


<div class="accordion" id="reports">
    <g:each in="${categories}" var="category">

        <g:set var="categoryContent" value="${category.replaceAll("\\s", "_")}"/>
        <div class="accordion-group">
            <div class="accordion-heading header">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#reports" href="#${categoryContent}">
                    ${category}
                </a>
            </div>
            <div id="${categoryContent}" class="outputData accordian-body collapse">

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
            </div>

        </div>
    </g:each>

        <div id="metadata">
            Results include ${metadata.projects} projects, ${metadata.sites} sites and ${metadata.activities} activities

        </div>

</div>

<script>


    $('#reports').on('show', function (e) {
        var content = $(e.target);
        var columnized = content.find('.column').length > 0;
        if (!columnized){
            content.columnize({ columns: 2, lastNeverTallest:true, accuracy: 10 });
        }

    })
</script>
