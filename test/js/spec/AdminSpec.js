describe("RemoveUserPermissionViewModel Spec", function (){

    var originalUnblockUI;
    var originalBlockUI;
    var blockUIWithMessage;
    beforeAll(function (){
       window.fcConfig = {
           imageLocation:'/'
       };
        if (!window.bootbox) {
            window.bootbox = {alert:function(userDetails){
                    console.log("UserDetails Test: " + userDetails);
                }}
        }
        originalUnblockUI = $.fn.unblockUI;
        originalBlockUI = $.fn.blockUI;
        $.unblockUI = function() {};
        $.blockUI = function() {};
    });
    afterAll(function() {
        delete window.fcConfig;
        $.unblockUI = originalUnblockUI;
        $.blockUI = originalBlockUI;
    });


    function ajax_response(response) {
        var deferred = $.Deferred().resolve(response);
        return deferred.promise();
    }

    it('should search the userDetails when email address provided', function () {
        let options = {searchUser: "test/url"}
        let props = {}
        var email = "test@testing.com"
        var userDetails = {userId: "12345", emailAddress: email, firstName: "Test", lastName: "Testing"}

        spyOn($, "get").and.returnValue(
            ajax_response(userDetails)
        );

        var model = new RemoveUserPermissionViewModel(props, options)
        model.emailAddress = email
        model.searchUserDetails()


        expect(model.users().emailAddress).toEqual(userDetails.emailAddress);
        expect(model.users().userId).toEqual(userDetails.userId);
        expect(model.users().firstName).toEqual(userDetails.firstName);
        expect(model.users().lastName).toEqual(userDetails.lastName);

    });

    it('should throw an error message when user search with invalid email', function () {

        let options = {searchUser: "test/url"}
        let props = {}
        var email = "test@testing.com"
        var userDetails = {error: "error", emailAddress: email}

        spyOn($, "get").and.returnValue(
            ajax_response(userDetails)
        );

        spyOn(bootbox, 'alert');

        var model = new RemoveUserPermissionViewModel(props, options)
        model.emailAddress = email
        model.searchUserDetails()

        expect(bootbox.alert).toHaveBeenCalledWith('<span class="label label-important">This Email Address is invalid: </span><p>' + userDetails.emailAddress + '</p>');
    });


    it('should throw an error message when user not able to remove user id', function () {

        let options = {removeUser: "test/url"}
        let props = {}
        var userId = "12345"
        var userDetails = {error: "error", userId: userId}

        spyOn($, "get").and.returnValue(
            ajax_response(userDetails)
        );

        spyOn(bootbox, 'alert');

        var model = new RemoveUserPermissionViewModel(props, options);
        model.userId = userId
        model.removeUserDetails()

        expect(bootbox.alert).toHaveBeenCalledWith('<span class="label label-important">Failed to remove users from MERIT </span>'+'<p> Reason: '+ userDetails.error+'</p>');
    });

});
