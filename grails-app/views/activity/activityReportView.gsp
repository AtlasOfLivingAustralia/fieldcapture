<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>${report.name}</title>
    </g:if>
    <g:else>
        <meta name="layout" content="nrm_bs4"/>
        <title>View | ${report.name} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        ownerViewUrl: "${ownerViewURL}",
        bieUrl: "${grailsApplication.config.getProperty('bie.baseURL')}",
        imageLocation:"${assetPath(src:'/')}",
        imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
        speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}",
        excelOutputTemplateUrl:"${createLink(controller: 'activity', action:'excelOutputTemplate')}",
        searchBieUrl: "${createLink(controller:'species', action:'searchBie')}",
        speciesListUrl: "${createLink(controller:'proxy', action:'speciesItemsForList')}",
        speciesSearchUrl: "${createLink(controller:'project', action:'searchSpecies', id:activity.projectId, params:[surveyName:metaModel.name])}",
        speciesImageUrl: "${createLink(controller:'species', action:'speciesImage')}",
        context:<fc:modelAsJavascript model="${context}"/>,
        imageLeafletViewer: '${createLink(controller: 'resource', action: 'imageviewer', absolute: true)}',
        readonly:true,
        useGoogleBaseMap: ${grails.util.Environment.current == grails.util.Environment.PRODUCTION},
        prepopUrlPrefix:"${grailsApplication.config.getProperty('grails.serverURL')}",
        projectTargetsAndScoresUrl: "${createLink(controller:'project', action:'targetsAndScoresForActivity', id:activity.projectId, params:[activityId:activity.activityId])}",
        returnTo: "${returnTo}"
        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="activity.css"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <g:if test="${activity.lock && params.attemptedEdit}">
        <div class="row mb-2">
            <div class="col-sm-12 pl-3 pr-3">
                <div class="alert alert-danger report-locked">
                    <p class="text-dark">This form has been locked for editing by <fc:userDisplayName userId="${activity.lock.userId}" defaultValue="an unknown user"/> since ${au.org.ala.merit.DateUtils.displayFormatWithTime(activity.lock.dateCreated)}</p>
                    <p class="text-dark">To edit anyway, click the button below.  Note that if the user is currently making edits, those edits will be lost.</p>
                    <a href="${createLink(action:'overrideLockAndEdit', id:id, params:params)}"><button type="button" class="btn btn-sm btn-danger"><i class="fa fa-edit"></i> Edit Anyway</button></a>

                </div>
            </div>
        </div>

    </g:if>
    <g:if test="${au.org.ala.merit.Status.isReadOnly(report.status)}">
        <div class="row mb-2">
            <div class="col-sm-12 pl-3 pr-3">
                <div class="alert alert-danger report-readonly">
                    <p class="text-dark">Reporting has been temporarily disabled for this form.</p>
                </div>
            </div>
        </div>
    </g:if>
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <section aria-labelledby="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
                    <li class="breadcrumb-item"><a href="${contextViewUrl}">${context.name.encodeAsHTML()}</a></li>
                    <li class="breadcrumb-item active">${report.name}</li>
                </ol>
            </section>
        </g:if>
        <g:render template="/output/mapInDialogViewTemplate" plugin="ecodata-client-plugin"/>

        <g:render template="${reportHeaderTemplate}"/>
    </div>
<!-- ko stopBinding: true -->
    <g:each in="${metaModel?.outputs}" var="outputName">

        <g:if test="${outputName != 'Photo Points'}">
            <g:render template="/output/outputJSModel" plugin="ecodata-client-plugin"
                      model="${[viewModelInstance:activity.activityId+fc.toSingleWord([name: outputName])+'ViewModel',
                                edit:false, model:outputModels[outputName],
                                outputName:outputName]}"></g:render>
            <g:render template="/activity/reportOutputReadOnly"
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

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="forms-manifest.js"/>

<script>

    $(function(){

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = fcConfig.returnTo;
        });

        var metaModel = <fc:modelAsJavascript model="${metaModel}" default="{}"/>
        var activity = <fc:modelAsJavascript model="${activity}" default="{}"/>
        var site = ${site?.encodeAsJSON() ?: 'null' };
        var options = {
            performOverDeliveryCheck: ${printView ? 'false' : 'true'},
            projectTargetsAndScoresUrl: fcConfig.projectTargetsAndScoresUrl,
            projectViewUrl: fcConfig.projectViewUrl,
            siteViewUrl: fcConfig.siteViewUrl
        };
        var viewModel = new ActivityViewModel(
            activity,
            site,
            fcConfig.project,
            metaModel,
            ${themes ?: 'null'},
            options
        );

        ko.applyBindings(viewModel);
        if (metaModel && metaModel.supportsSites) {
            var reportSite =  <fc:modelAsJavascript model="${reportSite}" default="{}"/>
            var formFeatures = new ecodata.forms.FeatureCollection(reportSite ? reportSite.features : []);
            fcConfig.featureCollection = formFeatures;
            <g:if test="${!printView}">
            var mapOptions = {};
            if (fcConfig.useGoogleBaseMap) {
                mapOptions.baseLayersName = 'Google'; // Default is Open Street Maps
            }
            // Initialise our map so we can supply options (otherwise it's initialised  with  defaults)
            ecodata.forms.maps.featureMap(mapOptions);
            </g:if>
        }

        $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({type:'image', autoSize:true, nextEffect:'fade', preload:0, 'prevEffect':'fade'});

    });
</script>
<asset:deferredScripts/>

</body>
</html>
