//= require datatables.net/js/jquery.dataTables.js
//= require datatables.net-bs4/js/dataTables.bootstrap4.js
//= require datatables.net-buttons/js/dataTables.buttons.js
//= require datatables.net-buttons-dt/js/buttons.dataTables.js
//= require datatables.net-buttons/js/buttons.colVis.js
//= require datatables.net-buttons/js/buttons.html5.js
//= require datatables.net-buttons/js/buttons.print.js
//= require datatables.net-buttons-bs4/js/buttons.bootstrap4.js
//= require datatables/dataTables.moment.js
//= require prettytextdiff/jquery.pretty-text-diff.min.js
//= require prettytextdiff/diff_match_patch.js
//= require_self

/** Initialises the /admin/audit.gsp */
$(document).ready(function() {

    function doAuditSearch() {
        var searchTerm = $("#searchTerm").val();

        var searchType = $("#searchType").val();

        var url;
        switch (searchType) {
            case 'Project':
                url = fcConfig.projectSearchUrl;
                break;
            case 'Organisation':
                url = fcConfig.organisationSearchUrl;
                break;
            default:
                url = fcConfig.settingSearchUrl;
        }

        if (searchTerm || searchType == 'Setting / Site Blog') {
            window.location = url+"?searchTerm=" + searchTerm;
        }
    }

    $('#results-list').DataTable({
        "bSort": false,
        "oLanguage": {
            "sSearch": "Search: "
        }
    });
    $('.dataTables_filter input').attr("placeholder", "Name or Description");

    $("#btnSearch").click(function(e) {
        e.preventDefault();
        doAuditSearch()
    });

    $("#searchType").change(function() {
        var searchType = $("#searchType").val();
        $('#searchTerm').prop('disabled', searchType == 'Setting / Site Blog');
    })

});

/** Initialises the /admin/auditProject.gsp */
$(document).ready(function() {
    $('#audit-message-list').DataTable({
        "order": [[ 0, "desc" ]],
        "aoColumnDefs": [{ "sType": "date-uk", "aTargets": [0] }],
        "oLanguage": {
            "sSearch": "Search: "
        }
    });
    $('.dataTables_filter input').attr("placeholder", "Date, Action, Type, Name, User");
});


