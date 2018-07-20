<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>${report.name}</title>
    </g:if>
    <g:else>
        <meta name="layout" content="${hubConfig.skin}"/>
        <title>View | ${report.name} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        ownerViewUrl: "${ownerViewURL}",
        bieUrl: "${grailsApplication.config.bie.baseURL}",
        imageLocation:"${assetPath(src:'/')}",
        imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
        speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}",
        excelOutputTemplateUrl:"${createLink(controller: 'activity', action:'excelOutputTemplate')}",
        context:${fc.modelAsJavascript(model:context)},
        returnTo: "${returnTo}"
        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="activity.css"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <g:if test="${activity.lock}">
        <div class="alert alert-error">
            This form has been locked for editing by <fc:userDisplayName userId="${activity.lock.userId}" defaultValue="an unknown user"/> since ${au.org.ala.merit.DateUtils.displayFormatWithTime(activity.lock.dateCreated)}
            <p>
                To edit anyway, click the button below.  Note that if the user is currently making edits, those edits will be lost.
            </p>
            <p>
                <a class="btn" href="${createLink(action:'overrideLockAndEdit', id:id, params:params)}">Edit Anyway</a>
            </p>
        </div>
    </g:if>
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <ul class="breadcrumb">
                <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
                <li><a href="${contextViewUrl}">${context.name.encodeAsHTML()}</a> <span class="divider">/</span></li>
                <li class="active">
                    ${report.name}
                </li>
            </ul>
        </g:if>

        <g:render template="${reportHeaderTemplate}"/>

    </div>
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
                                disablePrepop: activity.progress != au.org.ala.merit.ActivityService.PROGRESS_PLANNED]}"
                      plugin="ecodata-client-plugin"></g:render>

        </g:if>
    </g:each>
<!-- /ko -->
    <g:if test="${metaModel.supportsPhotoPoints}">
        <div class="output-block" data-bind="with:transients.photoPointModel">
            <h3>Photo Points</h3>

            <g:render template="/site/photoPoints" model="${[readOnly:true]}"></g:render>

        </div>
    </g:if>
    <g:if test="${!printView}">
    <g:if test="${showNav}">
        <g:render template="navigation"></g:render>
        <asset:script>
        var url = '${g.createLink(controller: 'activity', action:'activitiesWithStage', id:activity.projectId)}';
        var activityUrl = '${g.createLink(controller:'activity', action:'index')}';
        var activityId = '${activity.activityId}';
        var projectId = '${activity.projectId}';
        var siteId = '${activity.siteId?:""}';
        var options = {navigationUrl:url, activityUrl:activityUrl, returnTo:fcConfig.returnTo};
        options.navContext = '${navContext}';


        ko.applyBindings(new ActivityNavigationViewModel('stayOnPage', projectId, activityId, siteId, options), document.getElementById('activity-nav'));
        </asset:script>
    </g:if>
    <g:else>
        <div class="form-actions">
            <button type="button" id="cancel" class="btn">return</button>
        </div>
    </g:else>
    </g:if>

</div>

<!-- templates -->
<g:render template="/shared/documentTemplate"/>
<g:render template="/output/formsTemplates" plugin="ecodata-client-plugin"/>

<asset:javascript src="common.js"/>
<asset:javascript src="forms-manifest.js"/>
<asset:deferredScripts/>

<script>

    $(function(){

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = fcConfig.returnTo;
        });

        var viewModel = new ActivityViewModel(
            ${(activity as JSON).toString()},
            ${site ?: 'null'},
            fcConfig.project,
            ${metaModel ?: 'null'},
            ${themes ?: 'null'});

        ko.applyBindings(viewModel);

        var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        if(mapFeatures !=null && mapFeatures.features !== undefined && mapFeatures.features.length >0){
            init_map_with_features({
                    mapContainer: "smallMap",
                    zoomToBounds:true,
                    zoomLimit:16,
                    featureService: "${createLink(controller: 'proxy', action:'feature')}",
                    wmsServer: "${grailsApplication.config.spatial.geoserverUrl}"
                },
                mapFeatures
            );
        }
        $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({type:'image', autoSize:true, nextEffect:'fade', preload:0, 'prevEffect':'fade'});

    });
</script>
</body>
</html>