<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit Help Links | Admin | Data capture | Atlas of Living Australia</title>

    <script>
        fcConfig = {
           documentBulkUpdateUrl: "${g.createLink(controller:"document", action:"bulkUpdate")}",
           documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
           imageLocation:"${assetPath(src:'/')}"
        }
    </script>
    <asset:stylesheet src="common.css"/>
</head>

<body>
<h3>Edit Help Resource Links</h3>

<div class="help-resource-titles row-fluid">
    <div class="span2 strong">Document Type</div>
    <div class="span4 strong">Title</div>
    <div class="span4 strong">URL</div>
</div>
<div id="help-resources" class="validationEngineContainer" data-bind="foreach:helpLinks">

    <div class="help-resource row-fluid">
        <div class="span2"><select data-bind="options:$parent.types, optionsText:'description', optionsValue:'type', value:type" class="input-medium"></select></div>
        <div class="span4"><input type="text" data-bind="value:name" class="input-xlarge" data-validation-engine="validate[required]"></div>
        <div class="span4"><input type="text" data-bind="value:externalUrl"  class="input-xlarge" data-validation-engine="validate[required,custom[url]]"></div>
    </div>


</div>


<div class="form-actions">
    <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Save</button>
    <button type="button" id="cancel" data-bind="click:cancel" class="btn">Cancel</button>
</div>

<asset:javascript src="common.js"/>
<asset:javascript src="attach-document.js"/>
<script>
    $(function() {
        var links = <fc:modelAsJavascript model="${helpLinks}" default="[]"/>;
        var helpViewModel = new HelpLinksViewModel(links, '#help-resources');

        ko.applyBindings(helpViewModel);
    });
</script>

</body>
</html>