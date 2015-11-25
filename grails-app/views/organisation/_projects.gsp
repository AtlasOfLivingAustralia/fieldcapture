<g:if test="${!disableProjectCreation}">
    <div class="row-fluid">
        <a href="${createLink(controller: 'project', action: 'create', params: [organisationId: organisation.organisationId])}"
           class="btn btn-small pull-right">
            <i class="icon-file"></i>&nbsp;<g:message code="project.create.crumb"/></a>
    </div>
</g:if>
<g:if test="${organisation.projects}">
    <table id="projectList" class="table table-striped" style="width:100%;">
        <thead></thead>
        <tbody></tbody>
        <tfoot>
        <tr></tr>

        </tfoot>
    </table>
</g:if>
<g:else>
    <div class="row-fluid">
        <span class="span12"><h4>${organisation.name} is not currently involved in any projects.</h4></span>
    </div>
</g:else>

<r:script>
$(function() {
    var projects = fcConfig.projects;
    $.each(projects, function(i, project) {
        project.startDate = project.contractStartDate || project.plannedStartDate;
        project.duration = project.contractDurationInWeeks || project.plannedDurationInWeeks;
    });

    var projectUrlRenderer = function(data, type, row, meta) {
        var projectId = projects[meta.row].projectId;
        if (!projectId) {
            return '';
        }
        return '<a href="'+fcConfig.viewProjectUrl+'/'+projectId+'">'+data+'</a>';
    };
    var dateRenderer = function(data, type, row) {
        if (type == 'display' || type == 'filter') {
            return convertToSimpleDate(data, false);
        }
        return data || '';
    };
    var agreementDateRenderer = function(data, type, row, meta) {
        var program = projects[meta.row].associatedProgram;
        if (program && program == 'Green Army') {
            var cell = '<a class="agreementDate">';


            if (!data) {
                cell += 'Enter date';
            }
            else {
                cell += dateRenderer(data, type, row);
            }
            cell += '</a>';
            return cell;
        }

        return 'n/a';
    };
    var statusRenderer = function(data) {
        var badge = 'badge';
        if (data && data.toLowerCase() == 'active') {
            badge += ' badge-success';
        }
        else {
            badge += ' badge-info';
        }
        return '<span style="text-transform:uppercase;" class="'+badge+'">'+data+'</span>';
    };
    var projectListHeader =  [
        {title:'Grant ID', width:'10%', render:projectUrlRenderer, data:'grantId'},
        <g:if test="${content.reporting?.visible}">{title:'Work Order', width:'10%', data:'workOrderId', defaultContent:''},</g:if>
        {title:'Name', width:'25%', data:'name'},
        <g:if test="${content.reporting?.visible}">{title:'Agreement Date', width:'10%', render:agreementDateRenderer, data:'serviceProviderAgreementDate'},</g:if>
        {title:'Contracted Start Date', width:'8%', render:dateRenderer, data:'startDate'},
        {title:'Contracted Project Length (weeks)', width:'4%', data:'duration', defaultContent:''},
        {title:'From Date', width:'8%', render:dateRenderer, data:'plannedStartDate'},
        {title:'To Date', width:'8%', render:dateRenderer, data:'plannedEndDate'},
        {title:'Actual duration', width:'4%', data:'plannedDurationInWeeks', defaultContent:''},

        {title:'Status', width:'4%', render:statusRenderer, data:'status'},
        {title:'Funding', width:'8%', data:'funding', defaultContent:''},
        {title:'Programme', width:'13%', data:'associatedProgram', defaultContent:''}];

    /** changes the cell contents to display a date picker and autosaves the agreement date once the date changes */
    var editAgreementDate = function(e) {

        var api = $('#projectList').dataTable().api();
        var cell = $(e.target).parents('td');
        cell.addClass('editing');
        var apiCell = api.cell('.editing');
        var value = apiCell.data();

        var current = cell.children();
        current.hide();
        var span = $('<span class="input-append"/>').appendTo(cell);
        var input = $('<input name="agreementDate" class="input-small">').datepicker({format: 'dd-mm-yyyy', autoclose: true, clearBtn:true, keyboardNavigation:false}).appendTo(span);

        var saveDate = function(isoDate) {
            cell.removeClass('editing');
            span.remove();
            var spinner = $('<r:img dir="images" file="ajax-saver.gif" alt="saving icon"/>').css('margin-left', '10px');
            cell.append(spinner);
            current.show();
            var project = projects[apiCell.index().row];
            $.ajax({
                 url: fcConfig.updateProjectUrl+'/'+project.projectId,
                 type: 'POST',
                 data: '{"serviceProviderAgreementDate":"'+isoDate+'"}',
                 contentType: 'application/json',

                 success: function (data) {
                     if (data.error) {
                         alert(data.detail + ' \n' + data.error);
                     } else {
                         apiCell.data(isoDate);
                     }
                 },
                 error: function (data) {
                     if (data.status == 401) {
                        alert("You do not have permission to edit this project.");
                     }
                     else {
                        alert('An unhandled error occurred: ' + data.status);
                     }
                },
                complete: function () {
                    spinner.remove();
                }
                });
        };

        var currentDate = stringToDate(value);
        if (currentDate) {
            var widget = input.data("datepicker");
            widget.setDate(currentDate);
        }
        input.datepicker('show');

        var changeHandler = function() {
            var dateVal = input.val();
            var isoDate = '';
            if (dateVal) {
                var date = input.datepicker('getDate');
                isoDate = convertToIsoDate(date);
            }

            if (isoDate != value) {
                saveDate(isoDate);
            }
            else {
                noSave();
            }

        };

        var noSave = function() {
            cell.removeClass('editing');
            span.remove();
            current.show();
        };


        ko.utils.registerEventHandler(input, "hide", changeHandler);
    };
    $('#projectList').dataTable( {
        "data": fcConfig.projects,
        "autoWidth":false,
        "columns": projectListHeader,
        "initComplete":function(settings) {
            $('#projectList tbody').on('click', 'a.agreementDate', editAgreementDate);
        },
        "footerCallback": function ( tfoot, data, start, end, display ) {
            var api = this.api();

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                                i : 0;
            };

            var fundingColumn = -1;
            $.each(projectListHeader, function(i, column) {
                if (column.data == 'funding') {
                    fundingColumn = i;
                    return false;
                }
            });

            if (fundingColumn < 0) {
                return;
            }
            // Total over all pages
            var total = api
                    .column( fundingColumn )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    } );

            // Total over this page
            var pageTotal = api
                    .column( fundingColumn, { page: 'current'} )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );

            // Update footer
            var footerRow = $(api.table().footer()).find('tr');
            var col = footerRow.find('td.fundingTotal');
            if (!col.length) {
                footerRow.append('<td colspan="'+fundingColumn+'"></td>');
                footerRow.append('<td class="fundingTotal">$'+pageTotal + ' ($'+total + ' total)'+'</td>');

            }
            else {
                col.text('$'+pageTotal + ' ($'+total + ' total)');
            }

        }
    });
});
</r:script>
