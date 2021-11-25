/**
 * Render project members and their roles, support pagination.
 */

function initialise(roles, currentUserId, hubId) {
    $('#alert').hide();
    var col = [
        {
            data: 'userId',
            name: 'userId',
            bSortable: false
},
        {
            data: 'displayName',
            name: 'displayName',
            bSortable: false
        },
        {
            data: 'role',
            render: function (data, type, row) {

                var $select = $("<select class=\"form-control form-control-sm\"></select>", {
                    "id": "role_" + row.userId,
                    "value": data
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
                // cannot delete the last admin
                if (table.ajax.json().totalNbrOfAdmins == 1 && row.role == "admin") {
                    return '';
                } else {
                    return '<a class="fa fa-remove tooltips href="" title="remove this user and role combination"><i class="icon-remove"></i></a>';
                }
            },
            bSortable: false
        }
    ];

    var table  = $('#member-list').DataTable( {
        "bFilter": false,
        "lengthChange": true,
        "processing": true,
        "serverSide": true,
        createdRow:function(row){
            $("#datecell", row).datepicker({format: "dd-mm-yyyy",autoclose: true});
        },
        "ajax": fcConfig.getMembersForHubPaginatedUrl + "/" + hubId,
        "columns":col

    } );


    $('#member-list').on("change", "tbody td:nth-child(3) select", function (e) {
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
                saveHubUser(userId, role, hubId, convertToSimpleDate(currentExpiry));

            } else {
                reloadMembers(); // reload table
            }
        });
    });

    $('#member-list').on("input changeDate", "tbody td:nth-child(4) input", function (e) {
        e.preventDefault();
        var expiryDate = $(this).val();
        var row = this.parentElement.parentElement;
        var data = table.row(row).data();
        var currentRole = data.role;
        var userId = data.userId;

        setUserExpiryDate(userId, expiryDate, hubId, currentRole);
        $('.datepicker').hide();
    });



    $('#member-list').on("click", "tbody td:nth-child(5) a", function (e) {
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
                    removeUserRole(userId, role);
                } else {
                    alert("Error: required params not provided: userId & role");
                }
            }
        });
    });

    function removeUserRole(userId, role) {
        $.ajax({
            url: fcConfig.removeHubUserUrl,
            data: {
                userId: userId,
                role: role,
                entityId: hubId
            }
        })
            .done(function (result) {
                displayAlertMessage("User was removed.");
                }
            )
            .fail(function (jqXHR, textStatus, errorThrown) {
                    alert(jqXHR.responseText);
                }
            )
            .always(function (result) {
                reloadMembers(); // reload table
            });
    }
}

function reloadMembers() {
    $('#member-list').DataTable().ajax.reload();
}

function setUserExpiryDate(userId, expiryDate, id, role) {
    if (checkDateFormat(expiryDate) || expiryDate === "") {
        $.ajax({
            url: fcConfig.userExpiryUrl,
            data: { userId: userId, role: role, entityId: id, expiryDate: expiryDate}
        })
            // .done(function(result) { updateStatusMessage2("user's expiry date updated "); })
            .done(function(result) { displayAlertMessage("User's expiry date updated."); })
            .fail(function(jqXHR, textStatus, errorThrown) {
                bootbox.alert(jqXHR.responseText);
            })
            .always(function(result) { reloadMembers(); });
    } else {
        $('.spinner').hide();
    }
}

function saveHubUser(userId, role, id, expiryDate) {
    if (userId && role) {
        $.ajax({
            url: fcConfig.addUserUrl,
            data: { userId: userId, role: role, entityId: id, expiryDate: expiryDate}
        })
            .done(function(result) { displayAlertMessage("User's role saved."); })
            .fail(function(jqXHR, textStatus, errorThrown) {
                bootbox.alert(jqXHR.responseText);
            })
            .always(function(result) { reloadMembers(); });
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

