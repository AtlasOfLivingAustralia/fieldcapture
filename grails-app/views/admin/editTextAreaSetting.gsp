<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Static pages - Edit ${settingTitle} | MERIT</title>
        <asset:stylesheet src="editSetting.css"/>
	</head>
	<body>

        <content tag="pageTitle">Static pages</content>
        <div id="wrapper" class="${containerType}">
            <div class="row">
                <div class="col-sm-12" id="">

                    <a id="back" href="${returnUrl}" class="btn btn-sm"><i class="fa fa-hand-o-left"></i> back to ${returnLabel}</a>
                    <h3>Edit &quot;${settingTitle}&quot; content</h3>

                    <g:form id="saveSettingContent" controller="admin" action="saveTextAreaSetting">
                        <g:hiddenField name="settingKey" value="${settingKey}" />
                        <g:hiddenField name="returnUrl" value="${returnUrl}" />

                        <div id="notes-button-bar" class="w-100 bg-white mb-3"></div>
                        <div style="padding-right:12px;">
                            <g:textArea class="border w-100 m-0" name="textValue" id="textValue" value="${textValue?:''.trim()}" rows="${!ajax ? 16 : 8}"
                                        cols="120"/>
                        </div>
                        <h4>Preview:</h4>
                        <div id="notes-preview" class="well well-small"></div>
                        <div class="d-none"><input type="text" name="copy_html" value="" id="copy_html" class="d-none"></div>


                        <div class="form-actions">
                            <button class="btn btn-sm btn-primary">Save</button>
                            <a href="${returnUrl}"><button type="button" class="btn btn-danger btn-sm">Cancel</button></a>
                        </div>

                    </g:form>
                </div>
            </div>
        </div>
    <asset:javascript src="editSetting.js"/>
    <script>
        $(document).ready(function (e) {
            setup_wmd({
                output_format: "markdown",
                input: "textValue",
                output: "copy_html",
                button_bar: "notes-button-bar",
                preview: "notes-preview",
                helpLink: "${assetPath(src:"wmd/markdownhelp.html")}"
            });
        });
    </script>
    </body>
</html>
