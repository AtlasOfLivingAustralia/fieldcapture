<%@ page import="au.org.ala.fieldcapture.DateUtils" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Report | Project | MERIT</title>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
        activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        organisationLinkBaseUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${resource(dir:'/images')}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"
    },
        here = window.location.href;

    </r:script>


    <r:require modules="knockout, activity, jqueryValidationEngine, merit_projects"/>
</head>
<body>
<div class="container">


    <h1>MERIT Project Summary</h1>

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
            <g:set var="funding" value="${(project.custom?.details?.budget?.overallTotal?:project.funding)}"/>
            <div class="span9">
                <g:if test="${funding}">
                    <g:formatNumber type="currency" number="${funding}"/>
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
        <div class="row-fluid" id="report-status">
            <div class="span3 title">Current report status</div>
            <div class="span9" data-bind="text:currentStatus"></div>
        </div>

    </div>

    <h3>Project Overview</h3>
    <p>${project.description}</p>

    <h3>Main project images</h3>

        <g:each in="${images}" var="image">
            <img src="${image.thumbnailUrl?:image.url}"/>
        </g:each>
    </p>

    <h3>Number of activities</h3>
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

    <h3>Supporting documents</h3>
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
    <h3>Project outcomes</h3>
    <table class="table table-striped">
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

    <g:each in="${outputModels}" var="outputModel">
        <g:render template="/output/outputJSModel" plugin="fieldcapture-plugin"
                  model="${[model:outputModel.value, outputName:outputModel.key, edit:false, speciesLists:[]]}"></g:render>
    </g:each>

    <g:if test="${latestStageReport}">

        <h3>Summary of project progress and issues</h3>
        <g:each in="${stageReportModel.outputs}" var="outputName">
            <g:render template="/output/readOnlyOutput"
                  model="${[divId:'latest-stage-report-'+outputName,
                            activity:latestStageReport,
                            outputModel:outputModels[outputName],
                            outputName:outputName,
                            activityModel:stageReportModel]}"
                  plugin="fieldcapture-plugin"></g:render>
        </g:each>

    </g:if>

    <g:if test="${project.risks?.rows}">
    <h3>Project risk</h3>

    <table class="table table-striped">
        <thead>
        <tr>
            <th>Type of threat / risk</th>
            <th>Description</th>
            <th>Likelihood</th>
            <th>Consequence</th>
            <th>Risk rating</th>
            <th>Current control / <br/>Contingency strategy</th>
            <th>Residual risk</th>
        </tr>
        </thead>
        <tbody>
        <g:each in="${project.risks.rows}" var="risk">
            <tr>
                <td>${risk.threat}</td>
                <td>${risk.description}</td>
                <td>${risk.likelihood}</td>
                <td>${risk.consequence}</td>
                <td>${risk.riskRating}</td>
                <td>${risk.currentControl}</td>
                <td>${risk.residualRisk}</td>
            </tr>
        </g:each>

        </tbody>
    </table>
    </g:if>

    <h3>Progress against each activity</h3>

    <g:each in="${activitiesByStage}" var="activitiesForStage">
        <h3>${activitiesForStage.key}</h3>
        <g:each in="${activitiesForStage.value}" var="activity">
            <div class="activity-header">
                <div class="row-fluid">
                    <div class="span3 title">Activity type</div>
                    <div class="span9">${activity.type}</div>
                </div>
                <div class="row-fluid">
                    <div class="span3 title">Status</div>
                    <div class="span9">${activity.progress}</div>
                </div>
                <div class="row-fluid">
                    <div class="span3 title">Description</div>
                    <div class="span9">${activity.description}</div>
                </div>
                <div class="row-fluid">
                    <div class="span3 title">Major theme</div>
                    <div class="span9">${activity.theme}</div>
                </div>
                <div class="row-fluid">
                    <div class="span3 title">Start date</div>
                    <div class="span9">${DateUtils.isoToDisplayFormat(activity.startDate ?: activity.plannedStartDate)}</div>
                </div>
                <div class="row-fluid">
                    <div class="span3 title">End date</div>
                    <div class="span9">${DateUtils.isoToDisplayFormat(activity.endDate ?: activity.plannedEndDate)}</div>
                </div>
            </div>
            <g:set var="activityModel" value="${activityModels.find{it.name == activity.type}}"/>
            <g:each in="${activityModel.outputs}" var="outputName">
                <g:if test="${outputName != 'Photo Points'}">
                    <g:render template="/output/readOnlyOutput"
                              model="${[activity:activity,
                                        outputModel:outputModels[outputName],
                                        outputName:outputName,
                                        activityModel:activityModel]}"
                              plugin="fieldcapture-plugin"></g:render>
                </g:if>

            </g:each>

        </g:each>
    </g:each>




</div>
<r:script>
    $(function() {

        var reports = <fc:modelAsJavascript model="${project.reports}"/>;
        var reportVM = new ProjectReportsViewModel({reports:reports});
        ko.applyBindings(reportVM, document.getElementById('report-status'));

    });
</r:script>
</body>
</html>