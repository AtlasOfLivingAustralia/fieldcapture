
<h3>${header}</h3>

<div class="row-fluid">
    <div class="span5">
        <h4>Update project "${header}"</h4>
        <div id="${attributeName}-button-bar" style="width:100%;background-color: white;"></div>
        <div style="padding-right:12px;">
            <g:textArea name="${attributeName}Input" id="${attributeName}Input" value="${project[attributeName]}" rows="16"
                        cols="120" style="width:100%;margin:0;"></g:textArea>
        </div>
        <div class="hide"><input type="text" name="${attributeName}Output" id="${attributeName}Output" class="hide"></div>

    </div>
    <div class="span5">
        <h4>Preview</h4>
        <div id="${attributeName}-preview" class="well well-small"></div>

    </div>

</div>
<div class="row-fluid">
    <span class="span3">
        <button class="btn btn-primary" data-bind="click:function(data, event){saveContent('${attributeName}', data, event)}">Save changes</button>
        <button class="btn" data-bind="click:function(data, event){cancelContentEdit('${attributeName}', data, event)}">Cancel</button>

    </span>
</div>

<r:script>
    function initialise${attributeName}() {
        setup_wmd({
                    output_format: "markdown",
                    input: "${attributeName}Input",
                    output: "${attributeName}Output",
                    button_bar: "${attributeName}-button-bar",
                    preview: "${attributeName}-preview",
                    helpLink: "${request.contextPath}/static/wmd/markdownhelp.html"
                });
    }

</r:script>