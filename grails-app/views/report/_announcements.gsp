<%@ page import="org.joda.time.DateTime" %>
<html>

<head>
    <style type="text/css">
    #announcementsTable th {
        white-space: normal;
    }

    #announcementsTable td {
        white-space: normal;
    }

    #announcementsTable table {
        width:100%;
    }
    </style>
</head>
<table id="announcementsTable" class="table table-striped">

</table>
    <g:set var="suffix" value="${au.org.ala.fieldcapture.DateUtils.displayFormat(new org.joda.time.DateTime())}"/>
    <script type="text/javascript">
    $(function() {

        var projectUrlRenderer = function(data, type, row, meta) {
            var projectId = events[meta.row].projectId;
            return '<a href="'+fcConfig.viewProjectUrl+'/'+projectId+'">'+data+'</a>';
        };
        var dateRenderer = function(data) {
            return convertToSimpleDate(data, false);
        };
        var webSiteUrlRenderer = function(data, type, row, meta) {
            return '<a href="'+data+'">'+data+'</a>';
        };

        var events = <fc:modelAsJavascript model="${events}"></fc:modelAsJavascript>;
        var columns =  [
            {title:'Programme', width:'13%', data:'associatedProgram'},
            {title:'Sub-programme', width:'13%', data:'associatedSubProgram'},
            {title:'Scheduled date', data:'eventDate', width:'5%', render:dateRenderer},
            {title:'Electorate/s', width:'10%', data:'electorate'},
            {title:'State/Territory', width:'10%', data:'state'},
            {title:'Name of NRM region', width:'10%', data:'nrm'},
            <g:if test="${params.showOrganisations}">{title:'Organisation', width:'10%', data:'organisationName'},
            {title:'CEO Name', width:'10%', data:'contact'},
            {title:'CEO contact number', width:'10%', data:'contact'},
            </g:if>
            {title:'Name of Grant round', data:'eventName'},
            {title:'Total value of grant round', data:'funding'},
            {title:'Information about this grant round', data:'eventDescription', width:'15%'},
            <g:if test="${params.showOrganisations}">
            {title:'For more information about these grants or how to apply go to', width:'10%', render:webSiteUrlRenderer, data:'organisationWebSite'},
            </g:if>
            {title:'Scheduled date for announcement of grant round outcome (2 week window)', data:'grantAnnouncementDate', width:'5%'},
            {title:'Type of event', data:'type'},
            {title:'Grant ID', width:'10%', render:projectUrlRenderer, data:'grantId'},
            {title:'Name', width:'25%', data:'name'},
            {title:'MERI plan approval status', data:'planStatus'}
        ];

        var typeColumn = 0;
        var scheduledDateColumn = 2;

        for (var i=0; i<columns.length; i++) {
            if (columns[i].data == 'type') {
                typeColumn = i;
                break;
            }
        }
        var dateSuffix = '${suffix}';
        var title = 'Output targets - '+dateSuffix;
        $('#announcementsTable').dataTable({
            "data": events,
            "order":[[typeColumn, 'asc'], [scheduledDateColumn, 'asc']],
            "autoWidth": false,
            "columns": columns,
            "dom": 'Blfrtip',

            buttons: [
                'copyHtml5',
                {
                    extend: 'excelHtml5',
                    title: title
                },
                {
                    extend: 'csvHtml5',
                    title: title
                }
            ]

        });


    });


</script>


</html>