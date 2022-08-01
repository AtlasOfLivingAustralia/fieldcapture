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
function initialiseAuditSearch() {

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

};

/** Initialises the /admin/auditProject.gsp */
function initialiseAuditTable() {
    $('#audit-message-list').DataTable({
        "order": [[ 0, "desc" ]],
        "aoColumnDefs": [{ "sType": "date-uk", "aTargets": [0] }],
        "oLanguage": {
            "sSearch": "Search: "
        }
    });
    $('.dataTables_filter input').attr("placeholder", "Date, Action, Type, Name, User");
};

function initialiseAuditTableServerSide(config) {
    var url = config.auditSearchUrl;
    $('#audit-message-list').DataTable({
        "order": [[ 0, "desc" ]],
        "aoColumnDefs": [{ "sType": "date-uk", "aTargets": [0] }],
        "oLanguage": {
            "sSearch": "Search: "
        },
        processing: true,
        serverSide: true,
        ajax: {
            url: url,
            data: function(options){
                var col, order
                for(var i in options.order){
                    order = options.order[i];
                    col = options.columns[order.column];
                    break;
                }
                options.sort = col.data;
                options.orderBy = order.dir
                options.q = (options.search && options.search.value) || ''
            }
        },
        "columns": [{
            data: 'date',
            name: 'date'
        },{
            data: 'eventType',
            name: 'eventType'
        },{
            data: 'entityType',
            render: function(data, type, row){
                return data && data.substr(data.lastIndexOf('.') + 1)
            }
        },{
            data:'entity.name',
            render: function(data, type, row){
                var name = (row.entity && row.entity.name) || '',
                    type = (row.entity && row.entity.type) || '',
                    id = row.entityId;
                return name + ' ' + type + ' <small>(' + id + ')</small>'
            },
            bSortable : false
        },{
            data: 'userName',
            bSortable : false
        },{
            render: function(data, type , row){
                return '<a target="_blank" rel="noopener" class="btn btn-small" href="'+ config.auditMessageUrl +'?id=' + row.id+ '"><i class="fa fa-search"></i></a>';

            },
            bSortable : false
        }]
    });
    $('.dataTables_filter input').attr("placeholder", "Date, Action, Type, Name, User");
};

