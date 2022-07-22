//= require base-bs4
//= require js-iso8601/js-iso8601.js
//= require underscore/underscore
//= require amplifyjs/amplify.min.js
//= require bootstrap-datepicker/js/bootstrap-datepicker.js
//= require bootbox/bootbox.all.min.js
//= require knockout/knockout-latest.js
//= require knockout-mapping/knockout.mapping.js
//= require jquery.validationEngine/3.1.0/jquery.validationEngine
//= require jquery.validationEngine/3.1.0/jquery.validationEngine-en
//= require blockui/jquery.blockUI.js
//= require momentjs/2.24.0/moment.min.js
//= require momentjs/2.24.0/locales/en-au.js
//= require momentjs/moment-timezone-with-data.min.js
//= require frigus02-vkbeautify/vkbeautify.js
//= require @danielfarrell/bootstrap-combobox/js/bootstrap-combobox.js
//= require lockService
//= require fieldcapture-application
//= require healthCheck
//= require knockout-utils
//= require knockout-dates
//= require knockout-custom-bindings
//= require wmd/wmd.js
//= require wmd/showdown.js
//= require pagination.js
//= require datatables.net/js/jquery.dataTables.js
//= require datatables.net-bs4/js/dataTables.bootstrap4.js
//= require datatables.net-buttons-dt/js/buttons.dataTables.js
//= require datatables.net-buttons/js/dataTables.buttons.js
//= require datatables.net-buttons/js/buttons.colVis.js
//= require datatables.net-buttons/js/buttons.html5.js
//= require datatables.net-buttons/js/buttons.print.js
//= require datatables.net-buttons-bs4/js/buttons.bootstrap4.js
//= require datatables/dataTables.moment.js


ActivityProgress = {
    planned: 'planned',
    started: 'started',
    finished: 'finished',
    deferred: 'deferred',
    cancelled:'cancelled',
};

ReportStatus = {
    ACTIVE: 'active',
    READ_ONLY: 'readonly',

    isReadOnly: function(status) {
        return status && status.toLowerCase() == this.READ_ONLY;
    }
}
