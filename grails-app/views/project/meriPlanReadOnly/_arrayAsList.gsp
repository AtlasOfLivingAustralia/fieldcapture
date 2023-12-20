<!-- ko if: ${source} && ${source}.length == 1 -->
<span data-bind="text:${source}"></span>
<!-- /ko -->

<!-- ko if: ${source} && ${source}.length > 1 -->
<ul class="meriList" data-bind="foreach:${source}">
    <li data-bind="text:$data"></li>
</ul>
<!-- /ko -->