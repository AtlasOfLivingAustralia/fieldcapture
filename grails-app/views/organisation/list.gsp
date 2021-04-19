<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Organisations | Field Capture</title>
    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            createOrganisationUrl: "${createLink(controller: 'organisation', action: 'create')}",
            viewOrganisationUrl: "${createLink(controller: 'organisation', action: 'index')}",
            organisationSearchUrl: "${createLink(controller: 'organisation', action: 'search')}",
            noLogoImageUrl: "${assetPath(src:'no-image-2.png')}"
            };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="organisation.css"/>
</head>

<body>
<div class="${containerType}">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item active">Organisations</li>
        </ol>
    </nav>
<g:if test="${allowOrganisationRegistration}">
    <div>
        <h2 style="display:inline">Registered

        Organisations</h2>

        <g:if test="${user}">
            <button class="btn btn-success pull-right" data-bind="click:addOrganisation">Register new organisation</button>
        </g:if>
    </div>
</g:if>
    <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.ORGANISATION_LIST_PAGE_HEADER}"/>
    <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <a href="${g.createLink(action:'create')}"><button class="btn btn-info btn-sm pull-right">Create Organisation</button></a>
    </g:if>
    <div class="row">
        <div class="col-sm-6">
            <div class="input-group">
                <input type="text" id="searchText" data-bind="value:searchTerm, valueUpdate:'keyup'" class="form-control form-control-sm"   aria-labelledby="Search Organisation" aria-describedby="basic-addon2" placeholder="Search organisations..." >
                <div class="input-group-append">
                    <span type="button" class="btn btn-sm btn-secondary disabled orgSearch"><i class="fa fa-search" style="color: #000000"></i></span>
                </div>
            </div>
        </div>
    </div>

    <h4>Found <span data-bind="text:pagination.totalResults"></span> organisations</h4>

    <hr/>

    <!-- ko foreach : organisations -->
        <div class="row organisation">
            <div class="organisation-logo"><img class="logo" data-bind="attr:{'src':logoUrl()?logoUrl():fcConfig.noLogoImageUrl}"></div>
            <div class="organisation-text">
                <h4>
                    <a data-bind="visible:organisationId,attr:{href:fcConfig.viewOrganisationUrl+'/'+organisationId}"><span
                            data-bind="text:name"></span></a>
                    <span data-bind="visible:!organisationId,text:name"></span>
                </h4>
                <div data-bind="html:description.markdownToHtml()"></div>
            </div>
        </div>
    <hr/>

    <!-- /ko -->

    <div class="row">
        <g:render template="/shared/pagination"/>
    </div>

</div>


<asset:script>

    $(function () {

        var organisationsViewModel = new ServerSideOrganisationsViewModel();

        ko.applyBindings(organisationsViewModel);


});

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="organisation.js"/>
<asset:deferredScripts/>

</body>

</html>
