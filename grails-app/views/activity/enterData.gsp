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
        <title>Edit | ${activity.type} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script type="text/javascript">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate', id: activity.activityId)}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
        bieUrl: "${grailsApplication.config.getProperty('bie.baseURL')}",
        speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}",
        documentUpdateUrl: "${g.createLink(controller:"document", action:"documentUpdate")}",
        documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
        imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
        imageLocation:"${assetPath(src:'/')}",
        savePhotoPointUrl:"${createLink(controller:'site', action:'ajaxUpdatePOI')}",
        deletePhotoPointUrl:"${createLink(controller:'site', action:'ajaxDeletePOI')}",
        excelOutputTemplateUrl:"${createLink(controller: 'activity', action:'excelOutputTemplate')}",
        excelDataUploadUrl:"${createLink(controller:'activity', action:'ajaxUpload')}",
        searchBieUrl:"${createLink(controller:'species', action:'searchBie')}",
        speciesListUrl:"${createLink(controller:'proxy', action:'speciesItemsForList')}",
        speciesSearchUrl:"${createLink(controller:'project', action:'searchSpecies', id:activity.projectId, params:[surveyName:metaModel.name])}",
        speciesImageUrl:"${createLink(controller:'species', action:'speciesImage')}",
        noImageUrl: "${assetPath(src:'nophoto.png')}",
        project:<fc:modelAsJavascript model="${project}"/>,
        featureServiceUrl:"${createLink(controller: 'proxy', action: 'feature')}",
        wmsServiceUrl:"${grailsApplication.config.getProperty('spatial.geoserverUrl')}",
        unlockActivityUrl:"${createLink(controller:'activity', action:'ajaxUnlock')}/<fc:currentUserId/>",
        projectActivitiesUrl:"${createLink(controller:'project', action:'searchActivities', id:activity.projectId)}",
        healthCheckUrl:"${createLink(controller:'ajax', action:'keepSessionAlive')}",
        prepopUrlPrefix:"${grailsApplication.config.getProperty('grails.serverURL')}"

        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="activity.css"/>

</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
<div id="koActivityMainBlock">
    <g:if test="${!printView}">
        <section aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
                <li class="breadcrumb-item"><g:link controller="project" action="index" id="${project.projectId}">Project</g:link></li>
                <li class="breadcrumb-item active"><span data-bind="text:type"></span></li>
            </ol>
        </section>
    </g:if>

    <g:if test="${metaModel.type == 'Report'}">

        <div class="row title-block well well-small input-block-level">
            <div class="col-sm-9 title-attribute">
                <h1><span data-bind="click:goToProject" class="clickable">${project?.name?.encodeAsHTML() ?: 'no project defined!!'}</span></h1>
                <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">Activity: <span data-bind="text:description"></span></h3>
                <g:if test="${metaModel.supportsSites && activity.siteId && site}">
                    <h3>Site: ${site.name}</h3>
                </g:if>

                <h4><span>${project.associatedProgram?.encodeAsHTML()}</span> <span>${project.associatedSubProgram?.encodeAsHTML()}</span></h4>
                <h4><span class="readonly-text" data-bind="text:projectStage"></span> <g:if test="${!hideDates}">from <span data-bind="text:plannedStartDate.formattedDate"></span> to <span data-bind="text:plannedEndDate.formattedDate"></span></g:if></h4>
                <div class="row space-after">
                    <div class="col-sm-6">
                        <label class="for-readonly inline">Report status</label>
                        <button type="button" class="btn btn-sm"
                                data-bind="activityProgress:progress"
                                style="line-height:16px;cursor:default;color:white">
                            <span data-bind="text: progress"></span>
                        </button>
                    </div>
                </div>
            </div>
            <g:if test="${metaModel.supportsSites && activity.siteId}">
            <div class="col-sm-3" id="map-holder">
                <div id="smallMap"  class="w-100 h-100"></div>
            </div>
            </g:if>
        </div>

    </g:if>
    <g:else>

        <div class="row title-block well well-small input-block-level">
            <div class="col-sm-10 title-attribute">
                <h1><span data-bind="click:goToProject" class="clickable">${project?.name?.encodeAsHTML() ?: 'no project defined!!'}</span></h1>
                <g:if test="${metaModel.supportsSites}">
                    <div class="row">
                        <div class="col-sm-1">
                            Site:
                        </div>
                        <div class="col-sm-2">
                            <fc:select class="form-control form-control-sm" data-bind='options:transients.project.sites,optionsText:"name",optionsValue:"siteId",value:siteId,optionsCaption:"Choose a site..."' printable="${printView}"/>
                        </div>
                        <div class="col-sm-3">Leave blank if this activity is not associated with a specific site.</div>
                    </div>
                </g:if>
                <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">Activity: <span data-bind="text:type"></span></h3>
                <h4><span>${project.associatedProgram?.encodeAsHTML()}</span> <span>${project.associatedSubProgram?.encodeAsHTML()}</span></h4>
            </div>
        </div>


        <div class="row">
            <div class="col-sm-9">
                <!-- Common activity fields -->

                <div class="row space-after">
                    <!-- ko if:transients.themes.length -->
                    <div class="col-sm-6">
                        <label for="theme">Major theme</label>
                        <select id="theme" data-bind="value:mainTheme, options:transients.themes, optionsCaption:'Choose..'" class="form-control form-control-sm input-xlarge">
                        </select>
                    </div>
                    <!-- /ko -->
                    <div class="col-sm-6">
                        <label class="for-readonly">Description</label>
                        <span class="readonly-text" data-bind="text:description"></span>
                    </div>
                </div>

                <div class="row space-after">
                    <div class="col-sm-6">
                        <label class="for-readonly inline">Project stage</label>
                        <span class="readonly-text" data-bind="text:projectStage"></span>
                    </div>
                    <div class="col-sm-6">
                        <label class="for-readonly inline">Activity progress</label>
                        <button type="button" class="btn btn-sm btn-small"
                                data-bind="activityProgress:progress"
                                style="line-height:16px;cursor:default;color:white">
                            <span data-bind="text: progress"></span>
                        </button>
                    </div>
                </div>

                <div class="row space-after">
                    <div class="col-sm-6">
                        <label class="for-readonly inline">Planned start date</label>
                        <span class="readonly-text" data-bind="text:plannedStartDate.formattedDate"></span>
                    </div>
                    <div class="col-sm-6">
                        <label class="for-readonly inline">Planned end date</label>
                        <span class="readonly-text" data-bind="text:plannedEndDate.formattedDate"></span>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6 required">
                        <label for="startDate"><b>Actual start date</b>
                            <fc:iconHelp title="Start date" printable="${printView}">Date the activity was started.</fc:iconHelp>
                        </label>
                        <g:if test="${printView}">
                            <div class="row">
                                <div class="input-group">
                                    <fc:datePicker targetField="startDate.date" bs4="true" class="form-control form-control-sm col-sm-2" name="startDate" data-validation-engine="validate[required,funcCall[validateDateField]]" printable="${printView}"/>
                                </div>

                            </div>
                        </g:if>
                        <g:else>
                            <div class="input-group">
                                <fc:datePicker targetField="startDate.date" bs4="true" class="form-control form-control-sm col-sm-2" name="startDate" data-validation-engine="validate[required,funcCall[validateDateField]]" printable="${printView}"/>
                            </div>
                        </g:else>
                    </div>
                    <div class="col-sm-6 required">
                        <label for="endDate"><b>Actual end date</b>
                            <fc:iconHelp title="End date" printable="${printView}">Date the activity finished.</fc:iconHelp>
                        </label>
                        <g:if test="${printView}">
                            <div class="row">
                                <div class="input-group">
                                    <fc:datePicker targetField="endDate.date" bs4="true" class="form-control form-control-sm col-sm-2" name="endDate" data-validation-engine="validate[future[startDate]]" printable="${printView}" />
                                </div>

                            </div>
                        </g:if>
                        <g:else>
                            <div class="input-group">
                                <fc:datePicker targetField="endDate.date" bs4="true" class="form-control form-control-sm col-sm-2" name="endDate" data-validation-engine="validate[future[startDate]]" printable="${printView}" />
                            </div>
                        </g:else>
                    </div>
                </div>


            </div>

            <div class="col-sm-3" id="map-holder">
                <div id="smallMap" class="w-100"></div>
            </div>

        </div>
    </g:else>

</div>

<g:render template="activityFormContents"/>

<g:if test="${!printView}">
    <div class="form-actions">
        <button type="button" id="save" class="btn btn-sm btn-primary">Save changes</button>
        <button type="button" id="cancel" class="btn btn-sm btn-danger">Cancel</button>
        <label class="checkbox inline" data-bind="visible:progress() != 'corrected'">
            <input data-bind="checked:transients.markedAsFinished" type="checkbox"> Mark this activity as finished.
        </label>
    </div>
    <g:render template="navigation"/>
</g:if>

</div>

<g:render template="/shared/timeoutMessage" model="${[url:createLink(action:'enterData', id:activity.activityId, params: [returnTo:navContext])]}"/>

<g:render template="/shared/documentTemplate"/>

%{--The modal view containing the contents for a modal dialog used to attach a document--}%
<g:render template="/shared/attachDocument"/>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="enterActivityData.js"/>

<script type="text/javascript">

    $(function(){
        var activity = JSON.parse('${(activity as JSON).toString().encodeAsJavaScript()}');

        // Release the lock when leaving the page.  async:false is deprecated but is still the easiest solution to achieve
        // an unconditional lock release when leaving a page.
        var locked = ${locked};
        if (locked) {
            var unlockActivity = function() {
                $.ajax(fcConfig.unlockActivityUrl+'/'+activity.activityId, {method:'POST', async:false});
            };
            window.onunload = unlockActivity;
        }

        var metaModel = <fc:modelAsJavascript model="${metaModel}"/>;
        var minOptionalSections = 1;
        if (!_.isUndefined(metaModel.minOptionalSectionsCompleted)) {
            minOptionalSections = metaModel.minOptionalSectionsCompleted;
        }
        var master = new Master(activity.activityId,
            {activityUpdateUrl: fcConfig.activityUpdateUrl,
                minOptionalSectionsCompleted: minOptionalSections,
                healthCheckUrl:fcConfig.healthCheckUrl});

        var site = null;
    <g:if test="${site}">
        site = <fc:modelAsJavascript model="${site}" default="{}"/>
    </g:if>

        var themes = <fc:modelAsJavascript model="${themes}" default="{}"/>
        var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        var viewModel = new ActivityHeaderViewModel(activity, site, fcConfig.project, metaModel, themes);

        ko.applyBindings(viewModel);
        viewModel.initialiseMap(mapFeatures);

        if (metaModel.formVersion != activity.formVersion) {
            viewModel.formVersion(metaModel.formVersion);
        }
        viewModel.dirtyFlag.reset();

    <g:if test="${params.progress}">
        var newProgress = '${params.progress}';
        if (newProgress == 'corrected') {
            viewModel.progress(newProgress);
        }
        else {
            viewModel.transients.markedAsFinished(newProgress == 'finished');
        }
    </g:if>

        master.register('activityModel', viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset, viewModel.updateIdsAfterSave);

        var url = '${g.createLink(controller: 'activity', action:'activitiesWithStage', id:activity.projectId)}';
        var activityUrl = '${g.createLink(controller:'activity', action:'enterData')}';
        var activityId = '${activity.activityId}';
        var projectId = '${activity.projectId}';
        var siteId = '${activity.siteId?:""}';
        var options = {navigationUrl:url, activityUrl:activityUrl};
        options.navContext = '${navContext}';
        options.returnTo = '${returnToUrl}';
        options.activityNavSelector = '#activity-nav';
        options.savedNavMessageSelector = '#saved-nav-message-holder';

        var navigationMode = '${navigationMode}';
        var activityNavigationModel = new ActivityNavigationViewModel(navigationMode, projectId, activityId, siteId, options);

        var outputModelConfig = {
          projectId:projectId,
          activityId:activityId,
          stage:  stageNumberFromStage('${activity.projectStage}'),
          disablePrepop : false,
          speciesConfig :<fc:modelAsJavascript model="${speciesConfig}"/>,
          recoveryDataStorageKey: 'activity-'+activityId
        };
        outputModelConfig = _.extend(fcConfig, outputModelConfig);

    <g:each in="${metaModel?.outputs}" var="outputName">
        <g:if test="${outputName != 'Photo Points'}">
            <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
            <g:set var="model" value="${outputModels[outputName]}"/>
            <g:set var="output" value="${activity.outputs.find {it.name == outputName} ?: [name: outputName]}"/>
            var blockId = "${blockId}";

            var output = <fc:modelAsJavascript model="${output}"/>;
            var config = <fc:modelAsJavascript model="${metaModel.outputConfig?.find{it.outputName == outputName}}" default="{}"/>;
            config.model = <fc:modelAsJavascript model="${model}"/>;
            config.namespace = blockId;
            config = _.extend({}, outputModelConfig, config);

        var context = {
            project:fcConfig.project,
            activity:activity,
            documents:activity.documents,
            site:activity.site
        };

        master.createAndBindOutput(output, context, config);

        </g:if>
    </g:each>

        ko.applyBindings(activityNavigationModel, document.getElementById('activity-nav'));

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#save').click(function () {
            master.save(activityNavigationModel.afterSave);
        });

        $('#cancel').click(function () {
            master.deleteSavedData();
            activityNavigationModel.cancel();
        });

        $('#validation-container').validationEngine('attach', {scroll: true});

        $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({type:'image', autoSize:true, nextEffect:'fade', preload:0, 'prevEffect':'fade'});

    });
</script>
<asset:deferredScripts/>
</body>
</html>
