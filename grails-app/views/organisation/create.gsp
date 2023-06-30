<%@ page import="java.nio.file.Files" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Create | Organisation | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            organisationSaveUrl: "${createLink(action:'ajaxCreate')}",
            prepopulateAbnUrl:"${createLink(action:'prepopulateAbn')}",
            organisationViewUrl: "${createLink(action:'index')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            returnTo: "${params.returnTo}"
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
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>
</div>

<asset:script>

    $(function () {
        var organisation = <fc:modelAsJavascript model="${organisation}"/>;
        abn = ko.observable('');
        var options = {prepopulateAbnUrl: fcConfig.prepopulateAbnUrl, abnSelector: '#abnSelector', organisationSaveUrl:fcConfig.organisationSaveUrl, serverUrl: fcConfig.serverUrl, organisationViewUrl: fcConfig.organisationViewUrl, returnTo: fcConfig.returnTo}

        var organisationViewModel = new OrganisationViewModel(organisation, options);
        autoSaveModel(organisationViewModel, fcConfig.organisationSaveUrl,
            {
                blockUIOnSave:true,
                blockUISaveMessage:'Creating organisation....',
                 serializeModel:function() {return organisationViewModel.modelAsJSON(true);}
            });
        organisationViewModel.save = function() {
            if ($('.validationEngineContainer').validationEngine('validate')) {
                organisationViewModel.saveWithErrorDetection(
                    function(data) {
                        var orgId = self.organisationId?self.organisationId:data.organisationId;

                        var url;
                        if (fcConfig.returnTo) {
                            if (fcConfig.returnTo.indexOf('?') > 0) {
                                url = fcConfig.returnTo+'&organisationId='+orgId;
                            }
                            else {
                                url = fcConfig.returnTo+'?organisationId='+orgId;
                            }
                        }
                        else {
                            url = fcConfig.organisationViewUrl+'/'+orgId;
                        }
                        window.location.href = url;
                    },
                    function(data) {
                        bootbox.alert('<span class="label label-important">Error</span><p>'+data.detail+'</p>');
                    }
                );

            }
        };

        ko.applyBindings(organisationViewModel);
        $('.validationEngineContainer').validationEngine();

        $("#cancel").on("click", function() {
            document.location.href = "${createLink(action:'list')}";
        });
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="organisation.js"/>
<asset:deferredScripts/>

</body>


</html>
