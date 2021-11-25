<!-- ko stopBinding: true -->
<div id="edit${attributeName}Content">
<h3>${header}</h3>
<div class="row">
    <div class="col-sm-5 alert d-none" data-bind="visible:message(), css:{'alert-error':error(), 'alert-success':success()}">
        <button class="close" data-bind="click:clearMessage" href="#">×</button>
        <span data-bind="text:message"></span>
    </div>
</div>
<div class="row space-after ml-1 well well-small">

        <h4>Update project "${header}"</h4>
        <div id="${attributeName}-button-bar" class="w-100 bg-white mb-2"></div>
        <div style="padding-right:12px;" class="w-100">
            <g:textArea name="${attributeName}Input" id="${attributeName}Input" class="border w-100 m-0" value="${project[attributeName]}" rows="16"
                        cols="120" />
        </div>
        <div class="d-none"><input type="text" name="${attributeName}Output" id="${attributeName}Output" class="d-none"></div>
</div>
<div>
        <h4>Preview</h4>
        <div id="${attributeName}-preview"></div>
</div>
<div class="row">
    <span class="col-sm-3">
        <button class="btn btn-sm btn-primary" data-bind="click:save${attributeName}">Save changes</button>
        <button class="btn btn-sm btn-danger" data-bind="click:cancelEdit${attributeName}">Cancel</button>

    </span>
</div>
</div>
<!-- /ko -->

<asset:script>
     window.${attributeName}ViewModel = function(project, initialValue) {
        var self = this;
        setup_wmd({
            output_format: "markdown",
            input: "${attributeName}Input",
            output: "${attributeName}Output",
            button_bar: "${attributeName}-button-bar",
            preview: "${attributeName}-preview",
            helpLink: "${assetPath(src:"wmd/markdownhelp.html")}"
        });

        self.message = ko.observable('');
        self.error = ko.observable(false);
        self.success = ko.observable(false);

        self.save${attributeName} = function() {

            var rawContent = $('#${attributeName}Input').val();
            var formattedContent = $('#${attributeName}Output').val();
            project['${attributeName}'](formattedContent);
            var payload = {};
            payload['${attributeName}'] = rawContent;
            payload.projectId = project.projectId;
            var url = fcConfig.projectUpdateUrl;
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(payload),
                contentType: 'application/json',
                success: function (data) {
                    if (data.error) {
                        self.message(data.detail + ' \n' + data.error);
                        self.error(true);
                    }
                    else {
                        self.message('${header} saved');
                        self.success(true);
                    }
                },
                error: function (data) {
                    self.message('An unhandled error occurred: ' + data.status);
                    self.error(true);
                }
            });
        };

        self.cancelEdit${attributeName} = function() {
            $('#${attributeName}Input').val(initialValue);
            $('#${attributeName}Input').focus();
            self.clearMessage();
        };

        self.clearMessage = function() {
            self.message('');
            self.error(false);
            self.success(false);
        };
    }

</asset:script>
