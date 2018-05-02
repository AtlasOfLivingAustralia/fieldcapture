<g:set var="reportsHeader" value="Project Reports"/>
<g:render template="/shared/reporting"></g:render>
<g:render template="/shared/declaration"/>

<br/>
<g:render template="serviceTargets"></g:render>


<asset:script>
    $(function() {
        fcConfig.scores = ${scores as grails.converters.JSON ?: []};
    });
</asset:script>