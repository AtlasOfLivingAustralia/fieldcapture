<!-- ko stopBinding: true -->
<g:each in="${metaModel?.outputs}" var="outputName">

    <g:if test="${outputName != 'Photo Points'}">
        <g:render template="/output/outputJSModel" plugin="ecodata-client-plugin"
                  model="${[viewModelInstance:activity.activityId+fc.toSingleWord([name: outputName])+'ViewModel',
                            edit:false, model:outputModels[outputName],
                            outputName:outputName]}"></g:render>
        <g:render template="/output/readOnlyOutput"
                  model="${[activity:activity,
                            outputModel:outputModels[outputName],
                            outputName:outputName,
                            activityModel:metaModel,
                            disablePrepop: activity.progress != au.org.ala.merit.ActivityService.PROGRESS_PLANNED]]}"
                  plugin="ecodata-client-plugin"></g:render>

    </g:if>
</g:each>
<!-- /ko -->

<asset:deferredScripts/>