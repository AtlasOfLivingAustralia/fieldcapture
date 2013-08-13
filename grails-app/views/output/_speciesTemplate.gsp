<span data-bind="with:${source}">
    <div>
        <select name="list" data-bind="visible: transients.availableLists.length, value:listId, options:transients.availableLists, optionsText: 'listName', optionsValue: 'listId'"></select>
        <input type="text" data-bind="${databindAttrs}"/>
        <span data-bind="visible: !transients.editing()">
            <span data-bind="text: name"></span> <a class="btn btn-mini" data-bind="click:edit" href="#" title="clear"><i class="icon-edit"></i>Edit</a>
        </span>
   </div>
</span>