<!-- ko if: ${source} && ${source}.length == 1 -->
<span data-bind="text:${source}"></span>
<!-- /ko -->

<!-- ko if: ${source} && ${source}.length > 1 -->
<ul class="meriList" >
    <!-- ko foreach:${source} -->
    <!-- ko if:$data != 'Other' -->
    <li data-bind="text:$data"></li>
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko if:_.contains(${source}, 'Other') -->
    <li data-bind="text:'Other: ' + ${otherSource?:"''"}"></li>
    <!-- /ko -->
</ul>
<!-- /ko -->
