<r:require modules="jquery_ui, jquery_bootstrap_datatable"/>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid" id="species-container">
<div class="row-fluid">
    <div class="clearfix">
        <h3 class="pull-left">Species of Interest</h3>
        <g:link style="margin-bottom:10px;" action="species" id="${project.projectId}" class="btn pull-right title-edit">Edit Species Lists</a></g:link>
    </div>
    <p class="well">Species lists can be selected to be used by this project when species information is required to be supplied as a part of activity reporting.
        Lists are created and managed using the <a href="http://lists.ala.org.au">ALA list tool</a></p>
</div>

<div class="row-fluid" data-bind="visible: speciesLists().length">
    <div class="span12">
        <table class="table table-striped">
            <thead>
            <tr> <th>Species List Name</th><th>Species Count</th><th>Used for</th>
            </thead>
            <tbody data-bind="foreach: speciesLists">
            <tr>
                <td data-bind="text:listName"></td>
                <td data-bind="text:itemCount"></td>
                <td data-bind="text:purpose"></td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<div class="row-fluid">
    <div data-bind="visible: !speciesLists().length" class="span12">
        This project does not have any species of interest.
    </div>
</div>

</div>
<r:script>
$(window).load(function(){

   function SpeciesViewModel (data) {
        var self = this;

        self.speciesLists = ko.observableArray(data.speciesLists !== undefined ? data.speciesLists : []);

    };

    var speciesViewModel = new SpeciesViewModel(${project ?: [:]});

    ko.applyBindings(speciesViewModel, document.getElementById('species-container'));

});

</r:script>
<!-- /ko -->