<%@ page import="grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>Print | ${activity.type} | Field Capture</title>
    </g:if>
    <g:else>
        <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
        <title>Edit | ${activity.type} | Field Capture</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
        bieUrl: "${grailsApplication.config.bie.baseURL}",
        imageLocation:"${resource(dir:'/images')}",
        imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
        speciesProfileUrl: "${createLink(controller: 'proxy', action: 'speciesProfile')}"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker,jQueryFileUploadUI,mapWithFeatures,species,activity,attachDocuments,imageViewer,jQueryFileDownload"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <ul class="breadcrumb">
                <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
                <li><a data-bind="click:goToProject" class="clickable">Project</a> <span class="divider">/</span></li>
                <li class="active">
                    <span data-bind="text:type"></span>
                    <span data-bind="text:startDate.formattedDate"></span><span data-bind="visible:endDate">/</span><span data-bind="text:endDate.formattedDate"></span>
                </li>
            </ul>
        </g:if>

        <div class="row-fluid title-block well well-small input-block-level">
            <div class="span12 title-attribute">
                <h1><span data-bind="click:goToProject" class="clickable">${project?.name?.encodeAsHTML() ?: 'no project defined!!'}</span></h1>
                <g:if test="${site}">
                    <h2><span data-bind="click:goToSite" class="clickable">Site: ${site.name?.encodeAsHTML()}</span></h2>
                </g:if>
                <h3>Activity: <span data-bind="text:type"></span></h3>
                <h4><span>${project.associatedProgram?.encodeAsHTML()}</span> <span>${project.associatedSubProgram?.encodeAsHTML()}</span></h4>
            </div>
        </div>

        <div class="row">
            <div class="${mapFeatures.toString() != '{}' ? 'span9' : 'span12'}" style="font-size: 1.2em">
                <!-- Common activity fields -->
                <div class="row-fluid">
                    <span class="span6"><span class="label">Description:</span> <span data-bind="text:description"></span></span>
                    <span class="span6"><span class="label">Type:</span> <span data-bind="text:type"></span></span>
                </div>
                <div class="row-fluid">
                    <span class="span6"><span class="label">Starts:</span> <span data-bind="text:startDate.formattedDate"></span></span>
                    <span class="span6"><span class="label">Ends:</span> <span data-bind="text:endDate.formattedDate"></span></span>
                </div>
                <div class="row-fluid">
                    <span class="span6"><span class="label">Project stage:</span> <span data-bind="text:projectStage"></span></span>
                    <span class="span6"><span class="label">Major theme:</span> <span data-bind="text:mainTheme"></span></span>
                </div>
                <div class="row-fluid">
                    <span class="span6"><span class="label">Activity status:</span> <span data-bind="text:progress"></span></span>
                </div>
            </div>
            <g:if test="${mapFeatures.toString() != '{}'}">
                <div class="span3">
                    <div id="smallMap" style="width:100%"></div>
                </div>
            </g:if>
        </div>

    </div>
<!-- ko stopBinding: true -->
    <g:each in="${metaModel?.outputs}" var="outputName">

        <g:if test="${outputName != 'Photo Points'}">
            <g:render template="/output/outputJSModel" plugin="fieldcapture-plugin"
                      model="${[viewModelInstance:activity.activityId+fc.toSingleWord([name: outputName])+'ViewModel',
                                edit:false, model:outputModels[outputName],
                                outputName:outputName]}"></g:render>
            <g:render template="/output/readOnlyOutput"
                      model="${[activity:activity,
                                outputModel:outputModels[outputName],
                                outputName:outputName,
                                activityModel:metaModel]}"
                      plugin="fieldcapture-plugin"></g:render>

        </g:if>
    </g:each>
<!-- /ko -->
    <g:if test="${metaModel.supportsPhotoPoints}">
        <div class="output-block" data-bind="with:transients.photoPointModel">
            <h3>Photo Points</h3>

            <g:render template="/site/photoPoints" plugin="fieldcapture-plugin" model="${[readOnly:true]}"></g:render>

        </div>
    </g:if>
    <g:render template="navigation"></g:render>


</div>

<!-- templates -->
<g:render template="/shared/documentTemplate" plugin="fieldcapture-plugin"/>
<g:render template="/shared/imagerViewerModal" model="[readOnly:false]"></g:render>

<r:script>

    var returnTo = "${returnTo}";

    $(function(){

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = returnTo;
        });

        var viewModel = new ActivityViewModel(
            ${(activity as JSON).toString()},
            ${site ?: 'null'},
            ${project ?: 'null'},
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

        var url = '${g.createLink(controller: 'activity', action:'activitiesWithStage', id:activity.projectId)}';
        var activityUrl = '${g.createLink(controller:'activity', action:'index')}';
        var activityId = '${activity.activityId}';
        var projectId = '${activity.projectId}';
        ko.applyBindings(new ActivityNavigationViewModel(projectId, activityId, {navigationUrl:url, activityUrl:activityUrl, returnTo:returnTo}), document.getElementById('activity-nav'));
    });
</r:script>
</body>
</html>