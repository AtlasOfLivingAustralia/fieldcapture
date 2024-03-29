<!-- ko stopBinding: true -->
<g:each in="${metaModel?.outputs}" var="outputName">
    <g:if test="${outputName != 'Photo Points'}">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>

        <g:render template="/activity/outputView" model="${[blockId:blockId, outputName:outputName, site:site, model:model]}"/>
        <g:render template="/output/outputJSModel" plugin="ecodata-client-plugin"
                  model="${[viewModelInstance:blockId+'ViewModel', edit:true, activityId:activity.activityId, model:model, outputName:outputName]}"/>
    </g:if>
</g:each>
<!-- /ko -->

<g:if test="${metaModel.supportsPhotoPoints}">
    <div class="output-block" data-bind="with:transients.photoPointModel">
        <h3>Photo Points</h3>

        <g:render template="/site/photoPoints"/>

    </div>
</g:if>