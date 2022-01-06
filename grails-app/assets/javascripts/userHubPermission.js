function SearchUserHubPermissionViewModel(options) {

    var defaults = {
        validationContainerSelector: '.validationEngineContainer'
    };
    var self =this;
    var config = $.extend({}, defaults, options);

    self.emailAddress = ko.observable()
    self.email = ko.observable();

}