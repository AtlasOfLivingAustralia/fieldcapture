<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${managementUnit.name.encodeAsHTML()} | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}&libraries=visualization"></script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <script disposition="head">
        var fcConfig = {
            reportOwner: {managementUnitId: '${managementUnit.managementUnitId}'},
            viewReportUrl: '${createLink(action:"viewReport", id:managementUnit.managementUnitId)}',
            editReportUrl: "${createLink(action:"editReport", id:managementUnit.managementUnitId)}",
            resetReportUrl: "${createLink(action:'resetReport', id:managementUnit.managementUnitId)}",
            reportPDFUrl: "${createLink(action:"reportPDF", id:managementUnit.managementUnitId)}",
            approveReportUrl: "${createLink(action:"ajaxApproveReport", id:managementUnit.managementUnitId)}",
            submitReportUrl: "${createLink(action:"ajaxSubmitReport", id:managementUnit.managementUnitId)}",
            rejectReportUrl: "${createLink(action:"ajaxRejectReport", id:managementUnit.managementUnitId)}",
            regenerateManagementUnitReportsUrl: "${createLink(action:"regenerateManagementUnitReports", id:managementUnit.managementUnitId)}",
            managementUnitSaveUrl: "${createLink(action:'ajaxUpdate', id:managementUnit.managementUnitId)}",
            geoSearchUrl: "${createLink(controller: 'home', action:'geoService')}",
            projectUrl: "${createLink(controller: "project", action:'index')}",
            siteUrl: "${createLink(controller: "site", action:'index')}",

            createBlogEntryUrl: "${createLink(controller: 'blog', action:'create', params:[managementUnitId:managementUnit.managementUnitId, returnTo:createLink(controller: 'managementUnit', action: 'index', id: managementUnit.managementUnitId, fragment: 'admin')])}",
            editBlogEntryUrl: "${createLink(controller: 'blog', action:'edit', params:[managementUnitId:managementUnit.managementUnitId, returnTo:createLink(controller: 'managementUnit', action: 'index', id: managementUnit.managementUnitId, fragment: 'admin')])}",
            deleteBlogEntryUrl: "${createLink(controller: 'blog', action:'delete', params:[managementUnitId:managementUnit.managementUnitId])}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="managementUnit.css"/>
    <asset:stylesheet src="leaflet-manifest.css"/>

</head>

<body>
<div class="container-fluid">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item">Management Units</li>
            <li class="breadcrumb-item active">${managementUnit.name}</li>
        </ol>

    </nav>

    <div class="banner">
        <span data-bind="visible:logoUrl"><img class="logo" data-bind="attr:{'src':logoUrl}"></span>

        <div class="pull-right" style="vertical-align: middle;">
            <span data-bind="foreach:transients.socialMedia">
                <a data-bind="attr:{href:link.url}"><img data-bind="attr:{src:logo('${assetPath(src: 'filetypes')}')}"/>
                </a>
            </span>
        </div>

        <div class="header-text" id="managementUnitName">
           <h2>${managementUnit.name}</h2>
        </div>
    </div>


    <div id="managementUnitDetails" class="clearfix">

        <g:render template="/shared/flashScopeMessage"/>


        <ul id="managementUnit-tabs" class="nav nav-tabs" data-tabs="tabs">
            <fc:tabList tabs="${content}"/>
        </ul>

        <div class="tab-content">
            <fc:tabContent tabs="${content}"/>
        </div>

        <div id="loading" class="text-center">
            <asset:image width="50px" src="loading.gif" alt="loading icon"/>
        </div>
    </div>

</div>
<g:render template="/shared/reportRejectionModalBs4"/>
<script type="text/html" id="loading">
<asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>
</script>

<asset:script>

    $(function () {
        var managementUnit =<fc:modelAsJavascript model="${managementUnit}"/>;
        var config = _.extend({reportingConfigSelector:'#reporting form'}, fcConfig);
        var managementUnitViewModel = new ManagementUnitPageViewModel(managementUnit, config);

        ko.applyBindings(managementUnitViewModel);
        managementUnitViewModel.initialise(); // Needs to happen after data binding.
        $('#loading').hide();

        $('#admin-tab').on('shown.bs.tab', function() {
            var storedAdminTab = amplify.store('managementUnit-admin-tab-state');
            // restore state if saved
            if (storedAdminTab === '') {
                $('#edit-managmentunit-details-tab').tab('show');
            } else {
                $(storedAdminTab+'-tab').tab('show');
            }
        });
    });

      $('#gotoEditBlog').click(function () {
            amplify.store('managementUnit-admin-tab-state', '#editManagementUnitBlog');
            $('#admin-tab').tab('show');
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="managementUnit.js"/>
<asset:deferredScripts/>

</body>

</html>