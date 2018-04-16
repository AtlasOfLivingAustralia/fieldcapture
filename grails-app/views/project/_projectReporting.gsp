<g:set var="reportsHeader" value="Project Reports"/>
<g:render template="/shared/reporting"></g:render>

<br/>
<g:render template="serviceTargets"></g:render>


<div class="validationEngineContainer" id="risk-validation">
    <g:render template="riskTable" model="[project: project]"/>
</div>


<asset:script>
    $(function() {
        fcConfig.scores = ${scores as grails.converters.JSON ?: []};
    });
</asset:script>