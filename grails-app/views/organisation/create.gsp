<%@ page import="java.nio.file.Files" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Create | Organisation | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script disposition="head">
        var fcConfig = {
            documentUpdateUrl: '${g.createLink(controller:"document", action:"documentUpdate")}',
            documentDeleteUrl: '${g.createLink(controller:"document", action:"deleteDocument")}',
            organisationEditUrl: '${g.createLink(action:"edit")}',
            organisationViewUrl: '${g.createLink(action:"index")}',
            organisationSearchUrl: '${g.createLink(action:'search')}',
            prepopulateAbnUrl:"${createLink(action:'prepopulateAbn')}",
            organisationListUrl: '${g.createLink(action:"list")}',
            organisationSaveUrl: "${createLink(action:'ajaxUpdate')}",
            i18nURL: "${g.createLink(controller: 'home', action: 'i18n')}",
            returnTo: "${createLink(action:'list')}"
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
            <li class="breadcrumb-item">
                <g:link controller="organisation" action="list">Organisations</g:link>
            </li>
            <li class="breadcrumb-item" data-bind="text:breadcrumbName"></li>
        </ol>
    </nav>
    <g:render template="organisationDetails"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save, disable: !(name())" class="btn btn-primary">Create</button>
        <button type="button" id="cancel" data-bind="click:cancel" class="btn">Cancel</button>
    </div>
</div>

<asset:script>

    $(function () {
        var organisation = <fc:modelAsJavascript model="${organisation}"/>;
       var options = {
           prepopulateAbnUrl: fcConfig.prepopulateAbnUrl,

           organisationSaveUrl:fcConfig.organisationSaveUrl,
           viewProjectUrl: fcConfig.viewProjectUrl,
           organisationViewUrl: fcConfig.organisationViewUrl,
           documentUpdateUrl: fcConfig.documentUpdateUrl,
           documentDeleteUrl: fcConfig.documentDeleteUrl,
           organisationEditUrl: fcConfig.organisationEditUrl,
           organisationListUrl: fcConfig.organisationListUrl,
           organisationDeleteUrl: fcConfig.organisationDeleteUrl,
           organisationSearchUrl: fcConfig.organisationSearchUrl,
           validationContainerSelector: '.validationEngineContainer',
           abnSelector: '#abnSelector',
           returnTo: fcConfig.returnTo };

        var organisationViewModel = new EditOrganisationViewModel(organisation, options);
        ko.applyBindings(organisationViewModel);
        organisationViewModel.attachValidation();
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="organisation.js"/>
<asset:deferredScripts/>

</body>


</html>
