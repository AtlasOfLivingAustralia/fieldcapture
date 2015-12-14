<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Organisations | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <r:script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            createOrganisationUrl: "${createLink(controller: 'organisation', action: 'create')}",
            viewOrganisationUrl: "${createLink(controller: 'organisation', action: 'index')}",
            organisationSearchUrl: "${createLink(controller: 'organisation', action: 'search')}"
            };
    </r:script>
    <r:require modules="knockout,mapWithFeatures,amplify,organisation"/>
    <style type="text/css">
    .organisation-logo {
        width: 200px;
        height: 150px;
        line-height: 146px;
        margin-right: 10px;
        overflow: hidden;
        padding: 1px;
        text-align: center;
        float:left;
        top:5px;
        left:5px;
    }
    .organisation {
        position:relative;
    }
    .organisation-text {
        margin-left: 10px;
        margin-top: 5px;
        float: left;
    }
</style>

</head>

<body>
<div class="${containerType}">
    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link><span class="divider">/</span>
        </li>
        <li class="active">Organisations<span class="divider"></span></li>
    </ul>
<g:if test="${allowOrganisationRegistration}">
    <div>
        <h2 style="display:inline">Registered

        Organisations</h2>

        <g:if test="${user}">
            <button class="btn btn-success pull-right" data-bind="click:addOrganisation">Register new organisation</button>
        </g:if>
    </div>
</g:if>
    <fc:getSettingContent settingType="${au.org.ala.fieldcapture.SettingPageType.ORGANISATION_LIST_PAGE_HEADER}"/>

    <div class="row-fluid">
        <div class="span6 input-append">
            <input id="searchText" data-bind="value:searchTerm, valueUpdate:'keyup'" class="span12" placeholder="Search organisations..." />
            <span class="add-on"><i class="fa fa-search"></i> </span>
        </div>
    </div>

    <h4>Found <span data-bind="text:pagination.totalResults"></span> organisations</h4>

    <hr/>

    <!-- ko foreach : organisations -->
        <div class="row-fluid organisation">
            <div class="organisation-logo" data-bind="visible:logoUrl"><img class="logo" data-bind="attr:{'src':logoUrl}"></div>
            <div class="organisation-text">
                <h4>
                    <a data-bind="visible:organisationId,attr:{href:fcConfig.viewOrganisationUrl+'/'+organisationId}"><span
                            data-bind="text:name"></span></a>
                    <span data-bind="visible:!organisationId,text:name"></span>
                </h4>
                <span data-bind="html:description.markdownToHtml()"></span>
            </div>
        </div>
    <hr/>

    <!-- /ko -->

    <div class="row-fluid">
        <g:render template="/shared/pagination"/>
    </div>

</div>


<r:script>

    $(function () {

        var organisationsViewModel = new ServerSideOrganisationsViewModel();

        ko.applyBindings(organisationsViewModel);


});

</r:script>

</body>

</html>