<span data-bind="with:${source}">
    <div>
        <input type="text" data-bind="value:name, ${databindAttrs} "/>
        <span data-bind="visible: !transients.editing()">
            <span data-bind="text: name"></span>
            <a href="#" data-bind="popover: {title: name, content: transients.speciesInformation}"><i class="icon-info-sign"></i></a>
            <a class="btn btn-mini" data-bind="click:edit" href="#" title="clear"><i class="icon-edit"></i>Edit</a>
        </span>
   </div>

</span>

