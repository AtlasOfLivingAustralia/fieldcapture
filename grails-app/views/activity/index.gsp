<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>Print | ${activity.type} | MERIT</title>
    </g:if>
    <g:else>
        <meta name="layout" content="nrm_bs4"/>
        <title>View | ${activity.type} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <asset:javascript src="jstimezonedetect/jstz.js"/>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
        bieUrl: "${grailsApplication.config.getProperty('bie.baseURL')}",
        searchBieUrl:"${createLink(controller:'species', action:'searchBie')}",
        speciesListUrl:"${createLink(controller:'speciesList', action:'speciesListItems')}",
        speciesSearchUrl:"${createLink(controller:'project', action:'searchSpecies', id:activity.projectId, params:[surveyName:metaModel.name])}",
        speciesImageUrl:"${createLink(controller:'species', action:'speciesImage')}",
        imageLocation:"${assetPath(src:'/')}",
        imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
        speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}",
        excelOutputTemplateUrl:"${createLink(controller: 'activity', action:'excelOutputTemplate')}",
        imageLeafletViewer: '${createLink(controller: 'resource', action: 'imageviewer', absolute: true)}',
        project:<fc:modelAsJavascript model="${project}"/>,
        returnTo: "${createLink(controller: "project", action: "index", id: activity.projectId)}"
        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="activity.css"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <g:if test="${activity.lock}">
        <div class="row mb-2">
            <div class="col-sm-12 pl-3 pr-3">
                <div class="alert alert-danger report-locked">
                    <div class="text-dark">This form has been locked for editing by <fc:userDisplayName userId="${activity.lock.userId}" defaultValue="an unknown user"/> since ${au.org.ala.merit.DateUtils.displayFormatWithTime(activity.lock.dateCreated)}</div>
                    <div class="text-dark">To edit anyway, click the button below.  Note that if the user is currently making edits, those edits will be lost.</div>
                    <a href="${createLink(controller:'activity', action:'overrideLockAndEdit', id:activity.activityId)}"><button type="button" class="btn btn-sm btn-danger"><i class="fa fa-edit"></i> Edit Anyway</button></a>
                </div>
            </div>
        </div>

    </g:if>
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <section aria-labelledby="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
                    <li class="breadcrumb-item"><g:link controller="project" action="index" id="${project?.projectId}">Project</g:link></li>
                    <li class="breadcrumb-item active">
                        <span data-bind="text:type"></span>
                        <span data-bind="text:startDate.formattedDate"></span><span data-bind="visible:endDate">/</span><span data-bind="text:endDate.formattedDate"></span>
                    </li>
                </ol>
            </section>
        </g:if>

        <div class="row title-block well well-small input-block-level">
            <div class="col-sm-10 title-attribute">
                <h1><span data-bind="click:goToProject" class="clickable">${project?.name?.encodeAsHTML() ?: 'no project defined!!'}</span></h1>
                <g:if test="${site}">
                    <h2><span data-bind="click:goToSite" class="clickable">Site: ${site.name?.encodeAsHTML()}</span></h2>
                </g:if>
                <h3>Activity: <span data-bind="text:type"></span></h3>
                <h4><span>${project.associatedProgram?.encodeAsHTML()}</span> <span>${project.associatedSubProgram?.encodeAsHTML()}</span></h4>
            </div>
        </div>
        <div class="row">
            <div class="${mapFeatures.toString() != '{}' ? 'col-sm-9' : 'col-sm-12'}" style="font-size: 1.2em">
                <!-- Common activity fields -->
                <div class="row">
                    <span class="col-sm-6"><span class="label">Description:</span> <span data-bind="text:description"></span></span>
                    <span class="col-sm-6"><span class="label">Type:</span> <span data-bind="text:type"></span></span>
                </div>
                <div class="row">
                    <span class="col-sm-6"><span class="label">Starts:</span> <span data-bind="text:startDate.formattedDate"></span></span>
                    <span class="col-sm-6"><span class="label">Ends:</span> <span data-bind="text:endDate.formattedDate"></span></span>
                </div>
                <div class="row">
                    <span class="col-sm-6"><span class="label">Project stage:</span> <span data-bind="text:projectStage"></span></span>
                    <span class="col-sm-6"><span class="label">Major theme:</span> <span data-bind="text:mainTheme"></span></span>
                </div>
                <div class="row">
                    <span class="col-sm-6"><span class="label">Activity status:</span> <span data-bind="text:progress"></span></span>
                </div>
            </div>
            <g:if test="${mapFeatures.toString() != '{}'}">
                <div class="col-sm-3">
                    <div id="smallMap" style="width:100%"></div>
                </div>
            </g:if>
        </div>

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
    <g:if test="${showNav}">
        <g:render template="navigation"></g:render>
        <asset:script>
        var url = '${g.createLink(controller: 'activity', action:'activitiesWithStage', id:activity.projectId)}';
        var activityUrl = '${g.createLink(controller:'activity', action:'index')}';
        var activityId = '${activity.activityId}';
        var projectId = '${activity.projectId}';
        var siteId = '${activity.siteId?:""}';
        var reportId = '${report?.reportId}';
        var options = {navigationUrl:url, activityUrl:activityUrl};
        options.navContext = '${navContext}';
        options.returnTo = '${returnToUrl}';


        ko.applyBindings(new ActivityNavigationViewModel('stayOnPage', projectId, activityId, siteId, options), document.getElementById('activity-nav'));
        </asset:script>
    </g:if>
    <g:else>
        <div class="form-actions">
            <button type="button" id="cancel" class="btn">return</button>
        </div>
    </g:else>

</div>

<!-- templates -->
<g:render template="/shared/documentTemplate"/>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="forms-manifest.js"/>
<asset:deferredScripts/>

<script>

    $(function(){

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = fcConfig.returnTo;
        });

        var viewModel = new ActivityViewModel(
            <fc:modelAsJavascript model="${activity}"/>,
            <fc:modelAsJavascript model="${site?: null}"/>,
            fcConfig.project,
            <fc:modelAsJavascript model="${metaModel?: null}"/>,
            <fc:modelAsJavascript model="${themes?: null}"/>,
            fcConfig
        );

        ko.applyBindings(viewModel);

        var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        if(mapFeatures !=null && mapFeatures.features !== undefined && mapFeatures.features.length >0){
            init_map_with_features({
                    mapContainer: "smallMap",
                    zoomToBounds:true,
                    zoomLimit:16,
                    featureService: "${createLink(controller: 'proxy', action:'feature')}",
                    wmsServer: "${grailsApplication.config.getProperty('spatial.geoserverUrl')}"
                },
                mapFeatures
            );
        }
        $('.imageList a[target="fancybox"]').attr('rel', 'gallery').fancybox({type:'image', autoSize:true, nextEffect:'fade', preload:0, 'prevEffect':'fade'});

    });
</script>
</body>
</html>
