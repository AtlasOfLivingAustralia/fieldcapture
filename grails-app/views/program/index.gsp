<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${program.name.encodeAsHTML()} | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}&libraries=visualization"></script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <script disposition="head">
        var fcConfig = {
            reportOwner: {programId: '${program.programId}'},
            reportCreateUrl: '${g.createLink( action:'createReport', id:program.programId)}',
            viewReportUrl: '${createLink(action:"viewReport", id:program.programId)}',
            editReportUrl: "${createLink(action:"editReport", id:program.programId)}",
            resetReportUrl: "${createLink(action:'resetReport', id:program.programId)}",
            reportPDFUrl: "${createLink(action:"reportPDF", id:program.programId)}",
            approveReportUrl: "${createLink(action:"ajaxApproveReport", id:program.programId)}",
            submitReportUrl: "${createLink(action:"ajaxSubmitReport", id:program.programId)}",
            rejectReportUrl: "${createLink(action:"ajaxRejectReport", id:program.programId)}",
            regenerateProgramReportsUrl: "${createLink(action:"regenerateProgramReports", id:program.programId)}",
            programSaveUrl: "${createLink(action:'ajaxUpdate', id:program.programId)}",
            geoSearchUrl: "${createLink(controller: 'home', action:'geoService')}",
            projectUrl: "${createLink(controller: "project", action:'index')}",
            siteUrl: "${createLink(controller: "site", action:'index')}",

            ///Todo checck the purpose of 'fragment'
            createBlogEntryUrl: "${createLink(controller: 'blog', action:'create', params:[programId:program.programId, returnTo:createLink(controller: 'program', action: 'index', id: program.programId, fragment: 'admin')])}",
            editBlogEntryUrl: "${createLink(controller: 'blog', action:'edit', params:[programId:program.programId, returnTo:createLink(controller: 'program', action: 'index', id: program.programId, fragment: 'admin')])}",
            deleteBlogEntryUrl: "${createLink(controller: 'blog', action:'delete', params:[programId:program.programId])}"
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="program.css"/>
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
            <li class="breadcrumb-item active">${program.name}</li>
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

        <div class="header-text">
            <h2>${program.name}</h2>
            <g:if test="${program.associatedOrganisations}">
                <g:each in="${program.associatedOrganisations}" var="org">
                    <div class="program-organisation">
                        <strong>${org.description}</strong> : <g:if test="${org.organisationId}">
                        <a href="${createLink(controller: 'organisation', action: 'index', id: org.organisationId)}">${org.name}</a>
                    </g:if>
                        <g:else>
                            ${org.name}
                        </g:else>

                    </div>

                </g:each>
            </g:if>
        </div>
    </div>


    <div id="programDetails" class="clearfix">

        <g:render template="/shared/flashScopeMessage"/>


        <ul id="program-tabs" class="nav nav-tabs" data-tabs="tabs">
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
        var program =<fc:modelAsJavascript model="${program}"/>;
        var config = _.extend({reportingConfigSelector:'#reporting form'}, fcConfig);
        var programViewModel = new ProgramPageViewModel(program, config);

        ko.applyBindings(programViewModel);
        programViewModel.initialise(); // Needs to happen after data binding.
        $('#loading').hide();

        $('#admin-tab').on('shown.bs.tab', function() {
            var storedAdminTab = amplify.store('program-admin-tab-state');
            // restore state if saved
            if (storedAdminTab === '') {
                $('#edit-program-details-tab').tab('show');
            } else {
                $(storedAdminTab+'-tab').tab('show');
            }
        });

      //Quick fix for tab click
      $('#sites-tab, #admin-tab, #projects-tab,#about-tab').click(function () {
          event.preventDefault();
          window.location = this["href"]
      })
    });

    $('#gotoEditBlog').click(function () {
            amplify.store('program-admin-tab-state', '#editProgramBlog');
            $('#admin-tab').tab('show');
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="program.js"/>
<asset:deferredScripts/>

</body>

</html>