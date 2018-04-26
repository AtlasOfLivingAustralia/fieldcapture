<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>Print | ${activity.type} | Field Capture</title>
    </g:if>
    <g:else>
        <meta name="layout" content="${hubConfig.skin}"/>
        <title>Edit | ${activity.type} | Field Capture</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script type="text/javascript">
        var fcConfig = {
                serverUrl: "${grailsApplication.config.grails.serverURL}",
                activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate', id: activity.activityId)}",
                activityDeleteUrl: "${createLink(action:'delete',id:activity.activityId, params:[returnTo:grailsApplication.config.grails.serverURL + '/' + returnTo])}",
                contextViewUrl: "${contextViewUrl}/",
                siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
                bieUrl: "${grailsApplication.config.bie.baseURL}",
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
                context:${fc.modelAsJavascript(model:context)},
                featureServiceUrl:"${createLink(controller: 'proxy', action: 'feature')}",
                wmsServiceUrl:"${grailsApplication.config.spatial.geoserverUrl}",
                unlockActivityUrl:"${createLink(controller:'activity', action:'ajaxUnlock')}/<fc:currentUserId/>"
            },
            here = document.location.href;
    </script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="activity.css"/>

</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <ul class="breadcrumb">
                <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
                <li><a href="${contextViewUrl}">${context.name.encodeAsHTML()}</a> <span class="divider">/</span></li>
                <li class="active">
                    <span data-bind="text:type"></span>
                </li>
            </ul>
        </g:if>

        <g:if test="${metaModel.type == 'Report'}">

            <div class="row-fluid title-block well well-small input-block-level">
                <div class="span9 title-attribute">
                    <h1>${context.name.encodeAsHTML()}</h1>
                    <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}"><span data-bind="text:description"></span></h3>
                    <g:if test="${metaModel.supportsSites && activity.siteId && site}">
                        <h3>Site: ${site.name}</h3>
                    </g:if>

                    <h4><span>${context.associatedProgram?.encodeAsHTML()}</span> <span>${context.associatedSubProgram?.encodeAsHTML()}</span></h4>
                    <h4><span class="readonly-text" data-bind="text:projectStage"></span> from <span data-bind="text:plannedStartDate.formattedDate"></span> to <span data-bind="text:plannedEndDate.formattedDate"></span></h4>
                    <div class="row-fluid space-after">
                        <div class="span6">
                            <label class="for-readonly inline">Report status</label>
                            <button type="button" class="btn btn-small"
                                    data-bind="activityProgress:progress"
                                    style="line-height:16px;cursor:default;color:white">
                                <span data-bind="text: progress"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <g:if test="${metaModel.supportsSites && activity.siteId}">
                    <div class="span3" id="map-holder">
                        <div id="smallMap" style="width:100%"></div>
                    </div>
                </g:if>
            </div>

        </g:if>
        <g:else>
            <div class="row-fluid title-block well well-small input-block-level">
                <div class="span12 title-attribute">
                    <h1>${context?.name?.encodeAsHTML()}</h1>
                    <g:if test="${metaModel.supportsSites}">
                        <div class="row-fluid">
                            <div class="span1">
                                Site:
                            </div>
                            <div class="span8">
                                <fc:select data-bind='options:transients.context.sites,optionsText:"name",optionsValue:"siteId",value:siteId,optionsCaption:"Choose a site..."' printable="${printView}"/>
                                Leave blank if this activity is not associated with a specific site.
                            </div>
                        </div>
                    </g:if>
                    <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">Activity: <span data-bind="text:type"></span></h3>
                    <h4>${context.associatedProgram?.encodeAsHTML()} ${context.associatedSubProgram?.encodeAsHTML()}</h4>
                </div>
            </div>


            <div class="row-fluid">
                <div class="span9">
                    <!-- Common activity fields -->

                    <div class="row-fluid space-after">
                        <!-- ko if:transients.themes.length -->
                        <div class="span6">
                            <label for="theme">Major theme</label>
                            <select id="theme" data-bind="value:mainTheme, options:transients.themes, optionsCaption:'Choose..'" class="input-xlarge">
                            </select>
                        </div>
                        <!-- /ko -->
                        <div class="span6">
                            <label class="for-readonly">Description</label>
                            <span class="readonly-text" data-bind="text:description"></span>
                        </div>
                    </div>

                    <div class="row-fluid space-after">
                        <div class="span6">
                            <label class="for-readonly inline">Project stage</label>
                            <span class="readonly-text" data-bind="text:projectStage"></span>
                        </div>
                        <div class="span6">
                            <label class="for-readonly inline">Activity progress</label>
                            <button type="button" class="btn btn-small"
                                    data-bind="activityProgress:progress"
                                    style="line-height:16px;cursor:default;color:white">
                                <span data-bind="text: progress"></span>
                            </button>
                        </div>
                    </div>

                    <div class="row-fluid space-after">
                        <div class="span6">
                            <label class="for-readonly inline">Planned start date</label>
                            <span class="readonly-text" data-bind="text:plannedStartDate.formattedDate"></span>
                        </div>
                        <div class="span6">
                            <label class="for-readonly inline">Planned end date</label>
                            <span class="readonly-text" data-bind="text:plannedEndDate.formattedDate"></span>
                        </div>
                    </div>

                    <div class="row-fluid">
                        <div class="span6 required">
                            <label for="startDate"><b>Actual start date</b>
                                <fc:iconHelp title="Start date" printable="${printView}">Date the activity was started.</fc:iconHelp>
                            </label>
                            <g:if test="${printView}">
                                <div class="row-fluid">
                                    <fc:datePicker targetField="startDate.date" name="startDate" data-validation-engine="validate[required,funcCall[validateDateField]]" printable="${printView}"/>
                                </div>
                            </g:if>
                            <g:else>
                                <div class="input-append">
                                    <fc:datePicker targetField="startDate.date" name="startDate" data-validation-engine="validate[required,funcCall[validateDateField]]" printable="${printView}"/>
                                </div>
                            </g:else>
                        </div>
                        <div class="span6 required">
                            <label for="endDate"><b>Actual end date</b>
                                <fc:iconHelp title="End date" printable="${printView}">Date the activity finished.</fc:iconHelp>
                            </label>
                            <g:if test="${printView}">
                                <div class="row-fluid">
                                    <fc:datePicker targetField="endDate.date" name="endDate" data-validation-engine="validate[future[startDate]]" printable="${printView}" />
                                </div>
                            </g:if>
                            <g:else>
                                <div class="input-append">
                                    <fc:datePicker targetField="endDate.date" name="endDate" data-validation-engine="validate[future[startDate]]" printable="${printView}" />
                                </div>
                            </g:else>
                        </div>
                    </div>


                </div>

                <div class="span3" id="map-holder">
                    <div id="smallMap" style="width:100%"></div>
                </div>

            </div>
        </g:else>

    </div>

    <g:render template="/activity/activityFormContents"/>

    <g:if test="${!printView}">
        <div class="form-actions">
            <button type="button" id="save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
            <label class="checkbox inline" data-bind="visible:progress() != 'corrected'">
                <input data-bind="checked:transients.markedAsFinished" type="checkbox"> Mark this activity as finished.
            </label>
        </div>

        <g:render template="/activity/navigation"></g:render>
    </g:if>

</div>

<g:render template="/shared/timeoutMessage" model="${[url:createLink(action:'enterData', id:activity.activityId, params: [returnTo:returnTo])]}"/>

<g:render template="/shared/documentTemplate"></g:render>

%{--The modal view containing the contents for a modal dialog used to attach a document--}%
<g:render template="/shared/attachDocument"/>

<g:render template="/output/formsTemplates" plugin="ecodata-client-plugin"/>

<asset:javascript src="common.js"/>
<asset:javascript src="enterActivityData.js"/>

<script type="text/javascript">

    $(function(){
        var returnTo = "${returnTo}";
        var activity = JSON.parse('${(activity as JSON).toString().encodeAsJavaScript()}');

        // Release the lock when leaving the page.  async:false is deprecated but is still the easiest solution to achieve
        // an unconditional lock release when leaving a page.
        var locked = ${locked};
        if (locked) {
            var unlockActivity = function() {
                $.ajax(fcConfig.unlockActivityUrl+'/'+activityId, {method:'POST', async:false});
            };
            window.onunload = unlockActivity;
        }

        var master = new Master(activity.activityId, {activityUpdateUrl: fcConfig.activityUpdateUrl});

        var site = null;
        var mapFeatures = null;

        <g:if test="${site}">
        site = JSON.parse('${(site as JSON).toString().encodeAsJavaScript()}');
        mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        </g:if>

        var metaModel = ${metaModel};
        var themes = ${themes};

        var viewModel = new ActivityHeaderViewModel(activity, site, fcConfig.project, metaModel, themes);

        ko.applyBindings(viewModel);
        viewModel.initialiseMap(mapFeatures);
        // We need to reset the dirty flag after binding but doing so can miss a transition from planned -> started
        // as the "mark activity as finished" will have already updated the progress to started.
        if (activity.progress == viewModel.progress()) {
            viewModel.dirtyFlag.reset();
        }

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
        var options = {navigationUrl:url, activityUrl:activityUrl, returnTo:returnTo};
        options.navContext = '${navContext}';
        options.activityNavSelector = '#activity-nav';
        options.savedNavMessageSelector = '#saved-nav-message-holder';

        var navigationMode = '${navigationMode}';
        var activityNavigationModel = new ActivityNavigationViewModel(navigationMode, projectId, activityId, siteId, options);

        var outputModelConfig = {
            projectId:projectId,
            activityId:activityId,
            stage:  stageNumberFromStage('${activity.projectStage}'),
            disablePrepop : ${activity.progress == au.org.ala.merit.ActivityService.PROGRESS_FINISHED},
            speciesConfig :<fc:modelAsJavascript model="${speciesConfig}"/>
        };
        outputModelConfig = _.extend(fcConfig, outputModelConfig);

        <g:each in="${metaModel?.outputs}" var="outputName">
        <g:if test="${outputName != 'Photo Points'}">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>
        <g:set var="output" value="${activity.outputs.find {it.name == outputName} ?: [name: outputName]}"/>

        var viewModelName = "${blockId}ViewModel",
            elementId = "ko${blockId}";

        var output = <fc:modelAsJavascript model="${output}"/>;
        var config = ${fc.modelAsJavascript(model:metaModel.outputConfig?.find{it.outputName == outputName}, default:'{}')};
        config.model = ${fc.modelAsJavascript(model:model)},
            config = _.extend({}, outputModelConfig, config);

        initialiseOutputViewModel(viewModelName, config.model.dataModel, elementId, activity, output, master, config);
        </g:if>
        </g:each>

        ko.applyBindings(activityNavigationModel, document.getElementById('activity-nav'));

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#save').click(function () {
            master.save(activityNavigationModel.afterSave);
        });

        $('#cancel').click(function () {
            activityNavigationModel.cancel();
        });

        $('#validation-container').validationEngine('attach', {scroll: true});

        $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({type:'image', autoSize:true, nextEffect:'fade', preload:0, 'prevEffect':'fade'});

    });
</script>
<asset:deferredScripts/>
</body>
</html>