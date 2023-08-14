<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Edit | ${organisation.name.encodeAsHTML()} | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            viewProjectUrl: "${createLink(controller:'project', action:'index')}",
            documentUpdateUrl: '${g.createLink(controller:"document", action:"documentUpdate")}',
            documentDeleteUrl: '${g.createLink(controller:"document", action:"deleteDocument")}',
            organisationDeleteUrl: '${g.createLink(action:"ajaxDelete", id:organisation.organisationId)}',
            organisationEditUrl: '${g.createLink(action:"edit", id:organisation.organisationId)}',
            organisationViewUrl: '${g.createLink(action:"index", id:organisation.organisationId)}',
            prepopulateAbnUrl:"${createLink(action:'prepopulateAbn', id:organisation.organisationId)}",
            organisationListUrl: '${g.createLink(action:"list")}',
            organisationSaveUrl: "${createLink(action:'ajaxUpdate', id:organisation.organisationId)}",
            imageUploadUrl: "${createLink(controller: 'image', action:'upload')}",
            returnTo: "${params.returnTo?:createLink(action:'index', id:organisation.organisationId)}"

            };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="organisation.css"/>

</head>
<body>

<div class="${containerType} organisation-header organisation-banner image-box" data-bind="style:{'backgroundImage':asBackgroundImage(bannerUrl())}">

    <div class="row">
        <nav aria-label="breadcrumb" class="ml-3">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <g:link controller="home">Home</g:link>
                </li>
                <li class="breadcrumb-item">
                    <g:link controller="organisation" action="list">Organisations</g:link>
                </li>
                <li class="breadcrumb-item active">
                    ${organisation.name?.encodeAsHTML()}
                </li>
            </ol>
        </nav>
    </div>
    <g:render template="organisationDetails"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Save</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>

</div>

<asset:script>

   $(function () {
        var organisation = <fc:modelAsJavascript model="${organisation}"/>;
        var options = {prepopulateAbnUrl: fcConfig.prepopulateAbnUrl, abnSelector: '#abnSelector',
                       organisationSaveUrl:fcConfig.organisationSaveUrl,
                       viewProjectUrl: fcConfig.viewProjectUrl, serverUrl: fcConfig.serverUrl,
                       organisationViewUrl: fcConfig.organisationViewUrl,
                       documentUpdateUrl: fcConfig.documentUpdateUrl,
                       documentDeleteUrl: fcConfig.documentDeleteUrl,
                       organisationEditUrl: fcConfig.organisationEditUrl,
                       organisationListUrl: fcConfig.organisationListUrl,
                       organisationDeleteUrl: fcConfig.organisationDeleteUrl,
                       imageUploadUrl: fcConfig.imageUploadUrl, returnTo: fcConfig.returnTo }

        var organisationViewModel = new OrganisationViewModel(organisation, options);
        autoSaveModel(organisationViewModel, fcConfig.organisationSaveUrl,
            {
                blockUIOnSave:true,
                blockUISaveMessage:'Saving organisation....',
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
            document.location.href = fcConfig.returnTo;
         });
    });


</asset:script>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document-no-ui.js"/>
<asset:javascript src="organisation.js"/>
<asset:deferredScripts/>

</body>
</html>
