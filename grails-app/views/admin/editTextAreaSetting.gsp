<!doctype html>
<html>
	<head>
		<meta name="layout" content="${layout?:'adminLayout'}"/>
		<title>Admin - Edit ${settingTitle} | Data capture | Atlas of Living Australia</title>
		<style type="text/css" media="screen">
		</style>
	</head>
	<body>
        <r:require modules="wmd" />
        <r:script>
                $(document).ready(function (e) {
                    setup_wmd({
                        output_format: "markdown",
                        input: "textValue",
                        output: "copy_html",
                        button_bar: "notes-button-bar",
                        preview: "notes-preview",
                        helpLink: "${request.contextPath}/static/wmd/markdownhelp.html"
                    });
                });
        </r:script>
        <content tag="pageTitle">Settings</content>
        <g:if test="${!ajax}">
            <a href="${createLink(controller:'admin', action:'settings')}" class="btn"><i class="icon-hand-left"></i> back to Settings</a>
            <h3>Edit &quot;${settingTitle}&quot; content</h3>
        </g:if>
        <g:form id="saveSettingContent" controller="admin" action="saveTextAreaSetting">
            <g:set var="spanN" value="${ajax ? 'span12' : 'span10'}"/>
            <g:hiddenField name="settingKey" value="${settingKey}" />
            <div class="row-fluid">
                <div class="${spanN}">
                    <div id="notes-button-bar" style="width:100%;background-color: white;"></div>
                    <div style="padding-right:12px;">
                        <g:textArea name="textValue" id="textValue" value="${textValue?:''.trim()}" rows="${!ajax ? 16 : 8}"
                                    cols="120" style="width:100%;margin:0;"></g:textArea>
                    </div>
                    <h4>Preview:</h4>
                    <div id="notes-preview" class="well well-small"></div>
                    <div class="hide"><input type="text" name="copy_html" value="" id="copy_html" class="hide"></div>
                </div>
            </div>
            <g:if test="${!ajax}">
                <div class="row-fluid">
                    <a class="btn" href="${createLink(controller:'admin', action:'settings')}">Cancel</a>
                    <button class="btn btn-primary">Save</button>
                </div>
            </g:if>
            <g:else>
            </g:else>
        </g:form>
    </body>
</html>
