<html>

<head>
    <style type="text/css">
    #outputTargets th {
        white-space: normal;
    }

    #outputTargets td {
        white-space: normal;
    }

    #outputTargets table {
        width:100%;
    }
    </style>
</head>
<table id="outputTargets" class="table table-striped">

</table>
    <script type="text/javascript">
    $(function() {


        var date = moment().format('YYYY-MM-DD');
        var scores = <fc:modelAsJavascript model="${scores}"></fc:modelAsJavascript>;
        var columns =  [
            {title:'Output Target measure', width:'200px', data:'score'}
        ];
        <g:each in="${programs}" var="program">
            columns.push({title:"${program} - Target", data:"${program} - Target", width:'50px'});
            columns.push({title:"${program} - Delivered", data:"${program} - Value", width:'50px'});
        </g:each>

        $('#outputTargets').dataTable({
            "data": scores,
            "order":[[0, 'asc']],
            "autoWidth":false,
            "columns": columns,
            "dom": 'Brtip',

            buttons: [
                'copyHtml5',
                {
                    extend: 'excelHtml5',
                    title: 'Output targets '+date
                },
                {
                    extend: 'pdfHtml5',
                    title: 'Output targets '+date
                },
                {
                    extend: 'csvHtml5',
                    title: 'Output targets '+date
                }
            ]
        });


    });


</script>


</html>