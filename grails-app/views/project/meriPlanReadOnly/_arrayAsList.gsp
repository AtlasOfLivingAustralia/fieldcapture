<!-- ko if: ${source} && ${source}.length == 1 -->
    <!-- ko foreach:${source} -->
    <!-- ko if:$data != 'Other' -->
    <span data-bind="text:$data"></span>
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko if:_.contains(${source}, 'Other') -->
    <span data-bind="text:'Other: ' + ${otherSource?:"''"}"></span>
    <!-- /ko -->
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
