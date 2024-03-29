%{-- Not using this tag as we want  a protocol-less import<gvisualization:apiImport/>--}%
<script type="text/javascript" src="//www.google.com/jsapi"></script>

<g:set var="targets" value="${metrics.targets}"/>
<g:set var="other" value="${metrics.other}"/>
<g:if test="${targets || other}">

    <g:if test="${targets}">
    <h3 style="margin-top:0;">Progress against Output Targets</h3>
    <g:render template="outputTargets" model="${[targets:targets]}"/>
    </g:if>

    <g:if test="${other}">

        <h3>Progress of Outputs without targets</h3>
        <div class="row outputs-without-targets">
                <g:each in="${other?.entrySet()}" var="metric" status="i">
                        <div class="well well-small">
                            <h3>${metric.key}</h3>
                            <g:each in="${metric.value}" var="score">
                                <fc:renderScore score="${score}"></fc:renderScore>
                            </g:each>
                        </div><!-- /.well -->

                </g:each>

        </div>
    </g:if>
</g:if>
<g:else>
    <p>No activities or output targets have been defined for this project.</p>
</g:else>

<asset:script>
    $(document).on('dashboardShown', function (){
        setTimeout(function() {
        var content = $('.outputs-without-targets');
        var columnized = content.find('.column').length > 0;
        if (!columnized){
            content.columnize({ columns: 2, lastNeverTallest:true, buildOnce:false, accuracy: 10 });
        }
        $('.helphover').data('popover', null);
        $('.helphover').popover({container:'body', animation: true, trigger:'hover'});
    }, 100)});
</asset:script>

