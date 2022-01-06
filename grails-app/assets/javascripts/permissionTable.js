/**
 * Render project members and their roles, support pagination.
 */

function initialise(roles, currentUserId, hubId, containerId) {

    var tableSelector = "#"+containerId
    $('#alert').hide();
    var col = [
        {
            data: 'userId',
            name: 'userId',
            bSortable: false,
            className: 'hubUserId',
            searchable: true
},
        {
            data: 'displayName',
            name: 'displayName',
            bSortable: false,
            searchable: true
        },
        {
            data: 'role',
            render: function (data, type, row) {
                var $select = $('<select/>', {
                    'class': 'hub-form hub-form-control-sm ',
                    'id': 'role_' + row.userId,
                    'value': data
                });
                $.each(roles, function (i, value) {
                    var $option = $("<option></option>", {
                        "text": decodeCamelCase(value).replace('Case', 'Grant'),
                        "value": value
                    });
                    if (data === value) {
                        $option.attr("selected", "selected")
                    }
                    $select.append($option);
                });
                return $select.prop("outerHTML");
            },
            bSortable: false
        },
        {data:'expiryDate',
            render: function (date){
            if (date) {

                return "<input type='text' id='datecell' class=\"form-control form-control-sm\" value='" + convertToSimpleDate(date) + "'/>"
            } else {
                return "<input type='text' id='datecell' class=\"form-control form-control-sm\" value=''/>"
            }
            },bSortable: false
        },
        {
            render: function (data, type, row) {
                return '<a id="removeIcon" class="fa fa-remove tooltips href="" title="remove this user and role combination"><i class="icon-remove"></i></a>';
            },
            bSortable: false
        }
    ];

    var table  = $(tableSelector).DataTable( {

        "bFilter": true,
        "lengthChange": true,
        "processing": false,
        "serverSide": true,
        createdRow:function(row){
            $("#datecell", row).datepicker({format: "dd-mm-yyyy",autoclose: true});
        },
        "ajax": {"url": fcConfig.getMembersForHubPaginatedUrl + "/" + hubId,
        "type": "POST"},
        "columns":col,
        dom: 'lrtip'

        // ,
        // "language": {
        //     "search": "",
        //     "searchPlaceholder":"Search records..."
        //
        // }
        // ,
        // initComplete : function() {
        //     var input = $('.dataTables_filter input').unbind(),
        //         self = this.api(),
        //         $searchButton = $('<button type="submit" \n' +
        //             '                              class="btn btn-inverse dtSearchButton" \n' +
        //             '                              id="button_search" \n' +
        //             '                              data-toggle="tooltip" \n' +
        //             '                              title="Apply Search"\n' +
        //             '                              style="padding:0,5px,0,5px"\n' +
        //             '                      >\n' +
        //             '                      <i class="fas fa-search"></i>\n' +
        //             '                      </button>')
        //             .text('search')
        //             .click(function() {
        //                 self.search(input.val()).draw();
        //             }),
        //         $clearButton = $('<button type="button" class="btn btn-inverse dtSearchButton" id="button_trash" data-toggle="tooltip" title="Clear Search" style="padding:0,5px,0,5px" > <i class="fas fa-trash"></i> </button>')
        //             .text('clear')
        //             .click(function() {
        //                 input.val('');
        //                 $searchButton.click();
        //             })
        //     $('.dataTables_filter').append($searchButton, $clearButton);
        // }


    } );

    // $('.dataTables_filter input')
    //     .off()
    //     .on('keyup', function() {
    //         $('#example').DataTable().search(this.value.trim(), false, false).draw();
    //     });

    // $('#searchInput').on('keyup change', function () {
    //     // table.search(this.value).draw();
    //     table.column(2).search(this.value).draw();
    // });

    // $('#member-list').DataTable(
    //     { language: {
    //             searchPlaceholder: "Search records",
    //             search: "",
    //         }
    //     })

    $( table.table().body() )
        .addClass( 'highlight' );

    $(tableSelector).on('change', '.hub-form', function(e) {
        e.preventDefault();

        var role = $(this).val();
        var row = this.parentElement.parentElement;
        var data = table.row(row).data();
        var currentRole = data.role;
        var userId = data.userId;
        var currentExpiry = data.expiryDate;

        var message;
        if (userId == currentUserId) {
            message = "<span class='label label-important'>Important</span><p><b>If you modify your access level you may need assistance to get it back.</b></p><p>Are you sure you want to change your access from " + decodeCamelCase(currentRole) + " to " + decodeCamelCase(role) + "?</p>";
        }
        else {
            message = "Are you sure you want to change this user's access from " + decodeCamelCase(currentRole) + " to " + decodeCamelCase(role) + "?";
        }

        bootbox.confirm(message, function (result) {
            if (result) {
                saveHubUser(userId, role, hubId, convertToSimpleDate(currentExpiry), tableSelector);

            } else {
                reloadMembers(tableSelector); // reload table
            }
        });
    });

    $(tableSelector).on('input changeDate', '#datecell', function(e) {
        e.preventDefault();
        var expiryDate = $(this).val();
        var row = this.parentElement.parentElement;
        var data = table.row(row).data();
        var currentRole = data.role;
        var userId = data.userId;

        setUserExpiryDate(userId, expiryDate, hubId, currentRole, tableSelector);
        $('.datepicker').hide();
    });



    $(tableSelector).on("click", "#removeIcon", function (e) {
        e.preventDefault();

        var row = this.parentElement.parentElement;
        var data = table.row(row).data();
        var userId = data.userId;
        var role = data.role;

        var message;
        if (userId == currentUserId) {
            message = "<span class='label label-important'>Important</span><p><b>If you proceed you may need assistance to get your access back.</b></p><p>Are you sure you want to remove your access to this project?</p>";
        }
        else {
            message = "Are you sure you want to remove this user's access?";
        }
        bootbox.confirm(message, function (result) {
            if (result) {
                if (userId) {
                    removeUserRole(userId, role, tableSelector);
                } else {
                    alert("Error: required params not provided: userId & role");
                }
            }
        });
    });

    // $('input').on('change', function () {
    //     var val = $(this).val();
    //     alert("val: " + val);
    //     table.search( val ).draw();
    // })

    $('#email').on('change', function () {
        var val = $(this).val();
        // alert("val: " + val);
        table.search( val ).draw();
    })

    // $('#btnSearch').on('click', function () {
    //     var val = $('#email').val();
    //     alert("value: " + val);
    //     table.search( val ).draw();
    // })

    function removeUserRole(userId, role, tableSelector) {
        $.ajax({
            url: fcConfig.removeHubUserUrl,
            data: {
                userId: userId,
                role: role,
                entityId: hubId
            }
        })
            .done(function (result) {
                displayAlertMessage("User with user id: " + userId + " was removed.");
                }
            )
            .fail(function (jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            )
            .always(function (result) {
                reloadMembers(tableSelector); // reload table
            });
    }

}

function SearchUserHubPermissionViewModel1(options) {

    var self = this;
    var config = _.defaults(options);

    self.emailAddress = ko.observable()
    self.email = ko.observable();



}

function reloadMembers(tableSelector) {
    $(tableSelector).DataTable().ajax.reload();
}

function setUserExpiryDate(userId, expiryDate, id, role, tableSelector) {
    if (checkDateFormat(expiryDate) || expiryDate === "") {
        $.ajax({
            url: fcConfig.updateHubUser,
            data: { userId: userId, role: role, entityId: id, expiryDate: expiryDate}
        })
            .done(function(result) { displayAlertMessage("User's expiry date updated."); })
            .fail(function(jqXHR, textStatus, errorThrown) {
                bootbox.alert(jqXHR.responseText);
            })
            .always(function(result) { reloadMembers(tableSelector); });
    } else {
        $('.spinner').hide();
    }
}

function saveHubUser(userId, role, id, expiryDate, tableSelector) {
    if (userId && role) {
        $.ajax({
            url: fcConfig.updateHubUser,
            data: { userId: userId, role: role, entityId: id, expiryDate: expiryDate}
        })
            .done(function(result) { displayAlertMessage("User's role saved."); })
            .fail(function(jqXHR, textStatus, errorThrown) {
                bootbox.alert(jqXHR.responseText);
            })
            .always(function(result) { reloadMembers(tableSelector); });
    } else {
        alert("Required fields are: userId and role.");
        $('.spinner').hide();
    }
}


function updateStatusMessage2(msg) {
    $('#formStatus span').text(''); // clear previous message
    $('#formStatus span').text(msg).parent().fadeIn();
}



function checkDateFormat(dateField) {
    var date = stringToDate(dateField);
    if (isValidDate(date)) {
        return true;
    }
}


function displayAlertMessage(message) {
    var timeOut = 4
    $('#alert').show()
    $('#alert').text(message).fadeIn()
    $('#alert').css({"display": "block"})
    setTimeout(function() {
        $('#alert').fadeOut()
        $('#alert').css("display", "none")
    }, timeOut * 1000);
}

