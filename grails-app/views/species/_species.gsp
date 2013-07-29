<r:require modules="jquery_ui, jquery_bootstrap_datatable"/>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid" id="species-container">
<div class="row-fluid">
    <div class="clearfix"><h3 class="pull-left">Species of Interest</h3><a class="btn pull-right title-btn">Add Species Lists</a></div>
    <p class="well">Species lists can be selected to be used by this project when species information is required to be supplied as a part of activity reporting.
        Lists are created and managed using the <a href="http://lists.ala.org.au">ALA list tool</a></p>
</div>

<div class="row-fluid" data-bind="visible: speciesLists().length">
    <div class="span12">
        <table class="dyn table-striped">
            <thead>
            <tr> <th>Species List Name</th><th>Species Count</th><th>Used for</th><th></th>
            </thead>
            <tbody data-bind="foreach: speciesLists">
            <tr>
                <td data-bind="text:listName"></td>
                <td data-bind="text:itemCount"></td>
                <td><select data-bind="value:purpose, options:$root.activities"/></td>
                <td width="10%"><a class="btn btn-mini" data-bind="click:$root.removeSpeciesList" href="#" title="edit"><i class="icon-edit"></i> Remove</a></td>
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
<div class="row-fluid">
    <div class="span9"></div>
    <div class="span3"><button class="btn pull-right" data-bind="click:selectSpeciesLists">Add a Species List</button></div>
</div>
<div id="availableSpeciesLists" class="row-fluid">
    <div class="span12 well list-box">
        <h3 class="pull-left">Available Lists</h3>
        <span id="project-filter-warning" class="label filter-label label-warning hide pull-left">Filtered</span>
        <div class="control-group pull-right dataTables_filter">
            <div class="input-append">
                <g:textField class="filterinput input-medium" data-target="project"
                             title="Type a few characters to restrict the list." name="projects"
                             placeholder="filter"/>
                <button type="button" class="btn clearFilterBtn"
                        title="clear"><i class="icon-remove"></i></button>
            </div>
        </div>

        <div class="scroll-list clearfix" id="projectList">
            <table class="accordion" id="speciesLists">
                <thead class="hide"><tr><th>Name</th><th></th><th></th></tr></thead>
                <tbody>

                </tbody>
            </table>
        </div>

    </div>
</div>
</div>
<r:script>
$(window).load(function(){

    $('#availableSpeciesLists').hide();


    var SpeciesList = function(data) {
        this.listId = data.dataResourceUid;
        this.listName = data.listName;
        this.itemCount = data.itemCount;
        this.purpose = 'Reporting';
    }

    function SpeciesViewModel (data) {
        var self = this;

        self.speciesLists = ko.observableArray(data.speciesLists !== undefined ? data.speciesLists : []);
        self.availableLists = [];
        self.activities = ['Revegetation', 'Ferral animal assessment'];

        self.addSpeciesList = function(data, event) {
            var uid = $(event.currentTarget).data('listuid');
            $.each(self.availableLists, function(index, list) {
                if (list.dataResourceUid === uid) {
                    self.speciesLists.push(new SpeciesList(list));
                    $(event.currentTarget).parents('tr').hide();
                    return false;
                }
            });

        };
        self.removeSpeciesList = function(data, event) {
            self.speciesLists.remove(data);
        }
        self.selectSpeciesLists = function(data, event) {
            $('#availableSpeciesLists').dialog({
                buttons: [{
                    text: "OK",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }],
                width:"600px"
            });
        };

        self.removeTransients = function (jsData) {
            delete jsData.availableLists;
            return jsData;
        };
        self.save = function () {
            //if ($('.validation-container').validationEngine('validate')) {
                var jsData = ko.toJS(self);
                var json = JSON.stringify(self.removeTransients(jsData));
                var id = "${project?.projectId ? '/' + project.projectId : ''}";
                $.ajax({
                    url: "${createLink(action: 'ajaxUpdate')}" + id,
                    type: 'POST',
                    data: json,
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            alert(data.detail + ' \n' + data.error);
                        } else {
                            var projectId = "${project?.projectId}" || data.projectId;
                            if (data.message === 'created') {
                                document.location.href = "${createLink(controller: 'home', action: 'index')}";
                            } else {
                                document.location.href = "${createLink(action: 'index')}/" + projectId;
                            }
                        }
                    },
                    error: function (data) {
                        var status = data.status;
                        alert('An unhandled error occurred: ' + data.status);
                    }
                });
            //}
        }
    };

    var speciesViewModel = new SpeciesViewModel(${project ?: [:]});

    ko.applyBindings(speciesViewModel, document.getElementById('species-container'));

    $('#speciesLists').dataTable({
        "sAjaxSource": "/fieldcapture/proxy/speciesLists",
        "sAjaxDataProp":"lists",
        "aoColumns": [
            {"mData":"listName"},
            {"mData":function(obj, string, value) {return '<a href="#">'+obj.itemCount+'</a>';}},
            {"mData":function(obj, string, value){return '<button class="btn" data-listuid="'+obj.dataResourceUid+'" data-bind="click:addSpeciesList"/>Use this list'}}
        ],
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "oPaginate": {
                "sNext": "▶",
                "sPrevious": "◀"
            }
        },
        "bFilter": true,
        "bLengthChange": false,
        "bInfo": false,
        "fnInitComplete": function(oSettings, json) {
            speciesViewModel.availableLists = json.lists;
            ko.applyBindings(speciesViewModel, $('#speciesLists')[0]);
        }
    });


});

</r:script>
<!-- /ko -->