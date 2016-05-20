<%@ page import="au.org.ala.fieldcapture.DateUtils" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Report | Project | MERIT</title>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectUpdateUrl: "${createLink(action: 'ajaxUpdate', id: project.projectId)}",
        sitesDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDeleteSitesFromProject', id:project.projectId)}",
        siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDeleteSiteFromProject', id:project.projectId)}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
        siteEditUrl: "${createLink(controller: 'site', action: 'edit')}",
        removeSiteUrl: "${createLink(controller: 'site', action: '')}",
        activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
        activityEnterDataUrl: "${createLink(controller: 'activity', action: 'enterData')}",
        activityPrintUrl: "${createLink(controller: 'activity', action: 'print')}",
        activityCreateUrl: "${createLink(controller: 'activity', action: 'createPlan')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
        siteCreateUrl: "${createLink(controller: 'site', action: 'createForProject', params: [projectId:project.projectId])}",
        siteSelectUrl: "${createLink(controller: 'site', action: 'select', params:[projectId:project.projectId])}&returnTo=${createLink(controller: 'project', action: 'index', id: project.projectId)}",
        siteUploadUrl: "${createLink(controller: 'site', action: 'uploadShapeFile', params:[projectId:project.projectId])}&returnTo=${createLink(controller: 'project', action: 'index', id: project.projectId)}",
        starProjectUrl: "${createLink(controller: 'project', action: 'starProject')}",
        addUserRoleUrl: "${createLink(controller: 'user', action: 'addUserAsRoleToProject')}",
        removeUserWithRoleUrl: "${createLink(controller: 'user', action: 'removeUserWithRole')}",
        projectMembersUrl: "${createLink(controller: 'project', action: 'getMembersForProjectId')}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
        organisationLinkBaseUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${resource(dir:'/images')}",
        documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
        documentDeleteUrl: "${createLink(controller:"document", action:"deleteDocument")}",
        pdfgenUrl: "${createLink(controller: 'resource', action: 'pdfUrl')}",
        pdfViewer: "${createLink(controller: 'resource', action: 'viewer')}",
        imgViewer: "${createLink(controller: 'resource', action: 'imageviewer')}",
        audioViewer: "${createLink(controller: 'resource', action: 'audioviewer')}",
        videoViewer: "${createLink(controller: 'resource', action: 'videoviewer')}",
        errorViewer: "${createLink(controller: 'resource', action: 'error')}",
        createBlogEntryUrl: "${createLink(controller: 'blog', action:'create', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId)])}%23overview",
        editBlogEntryUrl: "${createLink(controller: 'blog', action:'edit', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId)])}%23overview",
        deleteBlogEntryUrl: "${createLink(controller: 'blog', action:'delete', params:[projectId:project.projectId])}",
        shapefileDownloadUrl: "${createLink(controller:'project', action:'downloadShapefile', id:project.projectId)}",
        regenerateStageReportsUrl: "${createLink(controller:'project', action:'regenerateStageReports', id:project.projectId)}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"

    },
        here = window.location.href;

    </r:script>


    <r:require modules="knockout, activity, jqueryValidationEngine"/>
</head>
<body>
<div class="container">

    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <li class="active">Projects <span class="divider">/</span></li>
        <li class="active" data-bind="text:name"></li>
    </ul>

    <div class="row-fluid">
        <div class="row-fluid">
            <div class="clearfix">
                <h1 class="pull-left" data-bind="text:name"></h1>
                <g:if test="${flash.errorMessage || flash.message}">
                    <div class="span5">
                        <div class="alert alert-error">
                            <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                            ${flash.errorMessage?:flash.message}
                        </div>
                    </div>
                </g:if>
                <div class="pull-right">
                    <g:set var="disabled">${(!user) ? "disabled='disabled' title='login required'" : ''}</g:set>
                    <g:if test="${isProjectStarredByUser}">
                        <button class="btn" id="starBtn"><i class="icon-star"></i> <span>Remove from favourites</span></button>
                    </g:if>
                    <g:else>
                        <button class="btn" id="starBtn" ${disabled}><i class="icon-star-empty"></i> <span>Add to favourites</span></button>
                    </g:else>
                </div>
            </div>
        </div>
    </div>

    <div class="overview">
        <div class="row-fluid">
            <div class="span3 title">Project Name</div>
            <div class="span9">${project.name}</div>
        </div>
        <div class="row-fluid">
            <div class="span3 title">Recipient</div>
            <div class="span9">${project.organisationName}</div>
        </div>
        <g:if test="${project.serviceProviderName}">
            <div class="row-fluid">
                <div class="span3 title">Service Provider</div>
                <div class="span9">${project.serviceProviderName}</div>
            </div>
        </g:if>
        <div class="row-fluid">
            <div class="span3 title">Funded by</div>
            <div class="span9">${project.associatedProgram}</div>
        </div>
        <div class="row-fluid">
            <div class="span3 title">Funding</div>
            <g:set var="funding" value="${(project.funding?:project.custom?.details?.budget?.overallTotal)}"/>
            <div class="span9">
                <g:if test="${funding}">
                    <g:formatNumber type="currency" number=""/>
                </g:if>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span3 title">Project start</div>
            <div class="span9"><g:formatDate format="dd MMM yyyy" date="${au.org.ala.fieldcapture.DateUtils.parse(project.plannedStartDate).toDate()}"/></div>
        </div>
        <div class="row-fluid">
            <div class="span3 title">Project finish</div>
            <div class="span9"><g:formatDate format="dd MMM yyyy" date="${au.org.ala.fieldcapture.DateUtils.parse(project.plannedEndDate).toDate()}"/></div>
        </div>
        <div class="row-fluid">
            <div class="span3 title">Grant ID</div>
            <div class="span9">${project.grantId}</div>
        </div>
        <g:if test="${project.externalId}">
            <div class="row-fluid">
                <div class="span3 title">External ID</div>
                <div class="span9">${project.externalId}</div>
            </div>
        </g:if>
        <div class="row-fluid">
            <div class="span3 title">Summary generated</div>
            <div class="span9"><g:formatDate format="yyyy-MM-dd HH:mm:ss" date="${new Date()}"/></div>
        </div>
        <div class="row-fluid">
            <div class="span3 title">Current report status</div>
            <div class="span9">maybe use knockout logic for this....</div>
        </div>

    </div>

    <h1>Project Overview</h1>
    <p>${project.description}</p>

    <h1>Main project images</h1>

        <g:each in="${images}" var="image">
            <img src="${image.thumbnailUrl?:image.url}"/>
        </g:each>
    </p>

    <h1>Number of activities</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <g:each in="${activityCountByStage}" var="entry">
                    <th colspan="2">${entry.key}</th>
                </g:each>
            </tr>
        </thead>
        <tbody>
            <g:each in="${['Planned', 'Started', 'Finished', 'Deferred', 'Cancelled']}" var="progress">
                <tr>
                    <g:each in="${activityCountByStage}" var="entry">
                        <td>${progress}</td>
                        <td>${entry.value[progress.toLowerCase()]?:0}</td>
                    </g:each>
                </tr>
            </g:each>

        </tbody>
    </table>

    <h1>Supporting documents</h1>
    <table class="table table-striped">
        <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
        </tr>
        </thead>
        <tbody>
        <g:each in="${project.documents}" var="document">
            <tr>
                <td>${document.name?:document.filename}</td>
                <td><fc:documentType document="${document}"/></td>
            </tr>
        </g:each>

        </tbody>
    </table>


    <g:if test="${outcomes}">
    <h1>Project outcomes</h1>
    <table>
        <thead>
        <tr>
            <th>Outcomes</th>
            <th>Assets Addressed</th>
        </tr>
        </thead>
        <tbody>
        <g:each in="${outcomes}" var="outcome">
            <tr>
                <td>${outcome.description}</td>
                <td>${outcome.assets}</td>
            </tr>
        </g:each>

        </tbody>
    </table>
    </g:if>

    <g:if test="${metrics.targets}">
        <h4>Progress against output targets</h4>
        <div class="row-fluid">
            <div class="span4">
                <g:set var="count" value="${metrics.targets.size()}"/>
                <g:each in="${metrics.targets?.entrySet()}" var="metric" status="i">
                %{--This is to stack the output metrics in three columns, the ceil biases uneven amounts to the left--}%
                    <g:if test="${i == Math.ceil(count/3) || i == Math.ceil(count/3*2)}">
                        </div>
                        <div class="span4">
                    </g:if>
                    <div class="well">
                        <h3>${metric.key}</h3>
                        <g:each in="${metric.value}" var="score">
                            <fc:renderScore score="${score}"></fc:renderScore>
                        </g:each>
                    </div>
                </g:each>
            </div>
        </div>
    </g:if>

    <h1>Summary of project progress and issues</h1>

    <h1>Project risk</h1>

    <h1>Progress against each activity</h1>

    <g:each in="${outputModels}" var="outputModel">
        <g:render template="/output/outputJSModel" plugin="fieldcapture-plugin"
                  model="${[model:outputModel.value, outputName:outputModel.key, edit:false, speciesLists:[]]}"></g:render>
    </g:each>


    <g:each in="${project.activities}" var="activity">
        <g:set var="activityModel" value="${activityModels.find{it.name == activity.type}}"/>
        <g:each in="${activityModel.outputs}" var="outputName">
            <g:set var="blockId" value="${activity.activityId+fc.toSingleWord([name: outputName])}"/>
            <g:set var="model" value="${outputModels[outputName]}"/>
            <g:set var="output" value="${activity.outputs.find {it.name == outputName}}"/>
            <g:if test="${!output}">
                <g:set var="output" value="[name: outputName]"/>
            </g:if>
            <div class="output-block" id="ko${blockId}">
                <h3>${outputName}</h3>
                <div data-bind="if:outputNotCompleted">
                    <label class="checkbox" ><input type="checkbox" disabled="disabled" data-bind="checked:outputNotCompleted"> <span data-bind="text:transients.questionText"></span> </label>
                </div>
                <g:if test="${!output.outputNotCompleted}">
                    <!-- add the dynamic components -->
                    <md:modelView model="${model}" site="${site}"/>
                </g:if>
                <r:script>
        $(function(){

            var viewModelName = "${fc.toSingleWord(name:outputName)}ViewModel";
            var viewModelInstance = "${blockId}Instance";

            var output = <fc:modelAsJavascript model="${output}"/>;
            var config = ${fc.modelAsJavascript(model:activityModel.outputConfig?.find{it.outputName == outputName}, default:'{}')};

            window[viewModelInstance] = new window[viewModelName](output, site, config);
            window[viewModelInstance].loadData(output.data || {}, <fc:modelAsJavascript model="${activity.documents}"/>);

            ko.applyBindings(window[viewModelInstance], document.getElementById("ko${blockId}"));
        });

                </r:script>
            </div>

        </g:each>

    </g:each>





</div>
</body>
</html>