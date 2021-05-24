<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit Help Links | Admin | MERIT</title>

    <script>
        fcConfig = {
           documentBulkUpdateUrl: "${g.createLink(controller:"document", action:"bulkUpdate")}",
           documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
           clearCacheUrl: "${g.createLink(controller:'admin', action:"clearCache")}",
           imageLocation:"${assetPath(src:'/')}"
        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
</head>

<body>
<h3>Edit Help Resource Links</h3>
<content tag="pageTitle">Help Resources</content>
<div class="help-resource-titles row">
    <div class="col-sm-2 strong">Document Type</div>
    <div class="col-sm-4 strong">Title</div>
    <div class="col-sm-4 strong">URL</div>
</div>
<div id="help-resources" class="validationEngineContainer" data-bind="foreach:helpLinks">

    <div class="help-resource row">
        <div class="col-sm-2"><select data-bind="options:$parent.types, optionsText:'description', optionsValue:'type', value:type" class="form-control form-control-sm mb-1"></select></div>
        <div class="col-sm-4"><input type="text" data-bind="value:name" class="form-control form-control-sm mb-1 input-medium" data-validation-engine="validate[required]"></div>
        <div class="col-sm-4"><input type="text" data-bind="value:externalUrl"  class="form-control form-control-sm mb-1" data-validation-engine="validate[required,custom[url]]"></div>
    </div>


</div>


<div class="form-actions ml-3 mt-4">
    <button type="button" id="save" data-bind="click:save" class="btn btn-primary btn-sm">Save</button>
    <button type="button" id="cancel" data-bind="click:cancel" class="btn btn-sm btn-danger">Cancel</button>
</div>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="attach-document.js"/>
<script>
    $(function() {
        var links = <fc:modelAsJavascript model="${helpLinks}" default="[]"/>;
        var options = {
            clearCacheUrl: fcConfig.clearCacheUrl,
            documentBulkUpdateUrl: fcConfig.documentBulkUpdateUrl,
            validationElementSelector: '#help-resources',
            healthCheckUrl: fcConfig.healthCheckUrl
        };
        var helpViewModel = new HelpLinksViewModel(links, options);

        ko.applyBindings(helpViewModel);
    });
</script>

</body>
</html>
