<%@ page import="au.org.ala.merit.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${organisation.name.encodeAsHTML()} | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}&libraries=visualization"></script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <g:set var="loadPermissionsUrl" value="${createLink(controller: 'user', action: 'getMembersOfOrganisation', id:organisation.organisationId)}"/>

    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            viewProjectUrl: "${createLink(controller:'project', action:'index')}",
            updateProjectUrl: "${createLink(controller: 'project', action:'ajaxUpdate')}",
            documentUpdateUrl: '${g.createLink(controller:"document", action:"documentUpdate")}',
            documentDeleteUrl: '${g.createLink(controller:"document", action:"deleteDocument")}',
            organisationDeleteUrl: '${g.createLink(action:"ajaxDelete", id:"${organisation.organisationId}")}',
            organisationEditUrl: '${g.createLink(action:"edit", id:"${organisation.organisationId}")}',
            organisationListUrl: '${g.createLink(action:"list")}',
            organisationSaveUrl: "${createLink(action:'ajaxUpdate', id:organisation.organisationId)}",
            organisationViewUrl: '${g.createLink(action:"index", id:organisation.organisationId)}',
            viewReportUrl: "${g.createLink(action:'viewOrganisationReport', id:organisation.organisationId)}",
            editReportUrl: "${g.createLink(action:'editOrganisationReport', id:organisation.organisationId)}",
            resetReportUrl: "${createLink(action:'resetReport', id:organisation.organisationId)}",
            regenerateOrganisationReportsUrl: "${createLink(action:"regenerateOrganisationReports", id:organisation.organisationId)}",
            reportPDFUrl: "${createLink(action:"printOrganisationReport", id:organisation.organisationId)}",
            organisationMembersUrl: "${loadPermissionsUrl}",
            imageLocation:"${assetPath(src:'/')}",
            logoLocation:"${assetPath(src:'/filetypes')}",
            adHocReportsUrl: '${g.createLink(action:"getAdHocReportTypes")}',
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport', params:[fq:'organisationFacet:'+organisation.name, organisationId:organisation.organisationId])}",
            performanceComparisonReportUrl: "${g.createLink(controller: 'report', action: 'performanceAssessmentComparisonReport', params:[organisationId:organisation.organisationId])}",
            performanceAssessmentSummaryReportUrl: "${g.createLink(controller: 'report', action: 'performanceAssessmentSummaryReport', params:[organisationId:organisation.organisationId])}",
            activityViewUrl: '${g.createLink(controller: 'activity', action:'index')}',
            activityEditUrl: '${g.createLink(controller: 'activity', action:'enterData')}',
            reportCreateUrl: '${g.createLink( action:'createAdHocReport', id:organisation.organisationId)}',
            submitReportUrl: '${g.createLink( action:'ajaxSubmitReport', id:"${organisation.organisationId}")}',
            approveReportUrl: '${g.createLink( action:'ajaxApproveReport', id:"${organisation.organisationId}")}',
            rejectReportUrl: '${g.createLink( action:'ajaxRejectReport', id:"${organisation.organisationId}")}',
            cancelReportUrl: "${createLink(action:'ajaxCancelReport', id:organisation.organisationId)}/",
            unCancelReportUrl: "${createLink(action:'ajaxUnCancelReport', id:organisation.organisationId)}/",
            reportsHistoryUrl:"${createLink(controller: 'report', action:'reportingHistory')}",
            returnTo: '${g.createLink(action:'index', id:"${organisation.organisationId}")}',
            dashboardCategoryUrl: "${g.createLink(controller: 'report', action: 'activityOutputs', params: [fq:'organisationFacet:'+organisation.name])}",
            reportOwner: {organisationId:'${organisation.organisationId}'},
            projects : <fc:modelAsJavascript model="${organisation.projects}"/>

        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="organisation.css" />
</head>
<body>

<div class="${containerType}">
    <g:render template="banner" model="${[imageUrl:assetPath(src:'filetypes')]}"/>

    <div id="organisationDetails"  class="clearfix" style="display:none;">

        <g:render template="/shared/flashScopeMessage"/>
        <ul id="orgTabs" class="nav nav-tabs" data-tabs="tabs">
            <fc:tabList tabs="${content}"/>
        </ul>

        <div class="tab-content" id="tabContent">
            <fc:tabContent tabs="${content}"/>
        </div>
        <div id="loading" class="text-center">
            <asset:image width="50px" src="loading.gif" alt="loading icon"/>
        </div>
    </div>
</div>

<g:render template="/shared/reportRejectionModal"/>

<asset:script>

    $(function () {

        var organisation =<fc:modelAsJavascript model="${organisation}"/>;
        var availableReportCategories = <fc:modelAsJavascript model="${content.admin?.availableReportCategories}"/>;
        var config = _.extend({
                reportingConfigSelector:'#reporting-config form',
                availableReportCategories:availableReportCategories,
            }, fcConfig);
        var organisationViewModel = new OrganisationPageViewModel(organisation, config);

        ko.applyBindings(organisationViewModel);
        organisationViewModel.initialise();
        $('#loading').hide();
        $('#organisationDetails').show();
    });

</asset:script>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="organisation-manifest.js"/>
<asset:deferredScripts/>

</body>


</html>
