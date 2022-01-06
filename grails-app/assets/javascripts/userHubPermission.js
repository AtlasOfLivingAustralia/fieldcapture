function SearchUserHubPermissionViewModel(options) {
    var self = this;
    var config = _.defaults(options);

    self.emailAddress = ko.observable()
    self.email = ko.observable();




    // self.searchUserDetails = function () {
    //     var emailAddress = self.emailAddress();
    //     var hubId = $('#hubId').val();
    //     console.log(config);
    //     console.log("emailAddress: " + emailAddress)
    //     console.log("hubId: " + hubId)
    //     if (emailAddress){
    //
    //         $.get(config.searchHubUser, {emailAddress: emailAddress, hubId: hubId}, undefined, "json").done(function (data){
    //             if (data.error === "error"){
    //                 bootbox.alert('<span class="label label-important">This Email Address is invalid: </span><p>' + data.emailAddress + '</p>');
    //             }else{
    //                 // need to setup datatable and populate data?
    //             }
    //         }).fail( function (){
    //             bootbox.alert('<span class="label label-important">This Email Address is invalid: </span><p>' + data.emailAddress + '</p>')
    //         });
    //     }else{
    //         bootbox.alert('<span class="label label-important">Please Enter the Email Address</span>');
    //     }
    //
    // };


}