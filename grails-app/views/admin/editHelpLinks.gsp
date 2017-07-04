<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit Help Links | Admin | Data capture | Atlas of Living Australia</title>
    <r:require modules="knockout,jqueryValidationEngine"/>
    <r:script disposition="head">
        fcConfig = {
           documentBulkUpdateUrl: "${g.createLink(controller:"document", action:"bulkUpdate")}",
           documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
           imageLocation:"${resource(dir:'/images')}"
        }
    </r:script>
</head>

<body>
<h3>Edit Help Resource Links</h3>

<div class="help-resource-titles row-fluid">
    <h4 class="span2">Document Type</h4>
    <h4 class="span4">Title</h4>
    <h4 class="span4">URL</h4>
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

<r:script>
    $(function() {
        var links = <fc:modelAsJavascript model="${helpLinks}" default="[]"/>;
        var helpViewModel = new HelpLinksViewModel(links, '#help-resources');

        ko.applyBindings(helpViewModel);
    });
</r:script>

</body>
</html>