<div class="control-group form-group row">
    <label class="control-label span3 col-form-label col-sm-3"><g:message code="g.socialMedia"/>:<fc:iconHelp><g:message
            code="g.socialMedia.help" args="[entity]"/></fc:iconHelp></label>

    <div class="span9 col-sm-9">
        <table class="table links-table controls">
            <tbody data-bind="foreach:transients.socialMedia">
            <tr>
                <td><img data-bind="attr:{alt:name,title:name,src:logo('${imageUrl}')}"/></td>
                <td><input type="url" data-bind="value:link.url" class="form-control"
                           data-validation-engine="validate[required,custom[url]]"/></td>
                <td style="vertical-align: middle"><a href="#" data-bind="click:remove"><i class="fa fa-remove"></i></a>
                </td>
            </tr>
            </tbody>
            <tfoot data-bind="visible:transients.socialMediaUnspecified().length > 0">
            <tr><td colspan="3">
                <select id="addSocialMedia" class="form-control"
                        data-bind="options:transients.socialMediaUnspecified,optionsText:'name',optionsValue:'role',value:transients.socialMediaToAdd,optionsCaption:'Add social media link...'"></select>
            </td></tr>
            </tfoot>
        </table>
    </div>
</div>
