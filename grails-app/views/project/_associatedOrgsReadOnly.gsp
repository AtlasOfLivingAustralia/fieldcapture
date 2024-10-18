<div class="associatedOrgs">
    <h3>History of organisations associated with this project</h3>

    <ul data-bind="foreach:associatedOrgs">
<li>
        <span>
            <!-- ko if: ko.utils.unwrapObservable($data.organisationId) -->
            <a href="" data-bind="attr:{href:$parent.organisationViewUrl + '/' + ko.utils.unwrapObservable($data.organisationId)}">
                <span data-bind="text:name"></span>
            </a>
            <!-- /ko -->

            <!-- ko if:!(ko.utils.unwrapObservable($data.organisationId)) -->
            <span data-bind="text:name"></span>
            <!-- /ko -->
        </span>
        <span>
            ( <span data-bind="text:description"></span>
            <!-- ko if:$data.fromDate -->
            <span> from <span data-bind="text:$data.fromDate.formattedDate"></span></span>
            <!-- /ko -->
            <!-- ko if:$data.toDate -->
            <span> to <span data-bind="text:$data.toDate.formattedDate"></span></span>
            <!-- /ko -->
            )
        </span>

</li>
    </ul>

</div>