<span data-bind="with:${source}">
    <div>
        <input type="text" data-bind="${databindAttrs}"/>
        <span data-bind="visible: !transients.editing()">
            <span data-bind="text: name"></span>
            <a href="#" class="helphover" data-bind="attr: {'data-original-title': name, 'data-content': transients.speciesInformation}" data-html="true"><i class="icon-question-sign"></i></a>
            <a class="btn btn-mini" data-bind="click:edit" href="#" title="clear"><i class="icon-edit"></i>Edit</a>
        </span>
   </div>

</span>

