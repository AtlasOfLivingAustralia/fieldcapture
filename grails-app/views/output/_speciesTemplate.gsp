<span data-bind="with:${source}">
        <div class="input-prepend"><span class="add-on" data-bind="visible:!transients.editing(), css:{'btn-success':name()}"><i class="icon-white" data-bind="css:{'icon-ok':listId()!='unmatched' && name(), 'icon-question-sign':listId()=='unmatched'}"></i></span><span class="add-on" data-bind="visible:transients.editing()"><r:img dir="images" file="ajax-saver.gif" alt="saving icon"/></span><input type="text" data-bind="${databindAttrs}"/></div>
        <span data-bind="visible: !transients.editing()">
            <a href="#" data-bind="popover: {title: name, content: transients.speciesInformation}"><i class="icon-info-sign"></i></a>
        </span>

</span>

